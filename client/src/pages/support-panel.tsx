import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, User, CheckCircle, AlertTriangle, Filter, Search, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messages: SupportMessage[];
}

interface SupportMessage {
  id: string;
  content: string;
  author: string;
  authorType: 'customer' | 'support';
  timestamp: string;
  attachments?: string[];
}

export default function SupportPanel() {
  const { user, isAuthenticated, canAccessSupportPanel, getUserDisplayName } = useAuth();
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Verificar autenticación y permisos
  if (!isAuthenticated || !canAccessSupportPanel()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Acceso Denegado</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">No tienes permisos para acceder al panel de soporte.</p>
            <Button onClick={() => window.location.href = '/'}>Volver al inicio</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Datos de ejemplo para tickets
  useEffect(() => {
    setTickets([
        {
          id: 'TKT-001',
          subject: 'Problema con la tarjeta gráfica RTX 4090',
          description: 'Mi tarjeta gráfica no se reconoce correctamente en el sistema. He instalado los drivers más recientes pero sigue sin funcionar.',
          status: 'in_progress',
          priority: 'high',
          category: 'Hardware',
          customerName: 'Juan Pérez',
          customerEmail: 'juan@email.com',
          createdAt: '2024-12-01T10:00:00Z',
          updatedAt: '2024-12-01T14:30:00Z',
          assignedTo: 'Carlos Rodriguez',
          messages: [
            {
              id: 'MSG-001',
              content: 'Hola, tengo un problema con mi tarjeta gráfica nueva. No aparece en el administrador de dispositivos.',
              author: 'Juan Pérez',
              authorType: 'customer',
              timestamp: '2024-12-01T10:00:00Z'
            },
            {
              id: 'MSG-002',
              content: 'Hola Juan! Gracias por contactarnos. ¿Podrías verificar que la tarjeta esté correctamente conectada a la fuente de poder? Necesitas conectar los cables PCIe de 8 pines.',
              author: 'Carlos Rodriguez',
              authorType: 'support',
              timestamp: '2024-12-01T14:30:00Z'
            },
            {
              id: 'MSG-003',
              content: 'Sí, tengo conectados los cables. ¿Podría ser un problema de la fuente de poder? Tengo una de 650W.',
              author: 'Juan Pérez',
              authorType: 'customer',
              timestamp: '2024-12-01T15:15:00Z'
            }
          ]
        },
        {
          id: 'TKT-002',
          subject: 'Consulta sobre compatibilidad de RAM',
          description: 'Quiero saber si la RAM DDR5-6000 es compatible con mi motherboard ASUS ROG B650E',
          status: 'resolved',
          priority: 'medium',
          category: 'Consulta',
          customerName: 'María García',
          customerEmail: 'maria@email.com',
          createdAt: '2024-11-28T09:15:00Z',
          updatedAt: '2024-11-28T16:45:00Z',
          assignedTo: 'Ana Martinez',
          messages: [
            {
              id: 'MSG-004',
              content: 'Tengo una ASUS ROG B650E y quiero comprar RAM DDR5-6000. ¿Es compatible?',
              author: 'María García',
              authorType: 'customer',
              timestamp: '2024-11-28T09:15:00Z'
            },
            {
              id: 'MSG-005',
              content: 'Hola María! Sí, la ASUS ROG B650E es compatible con DDR5-6000. Solo asegúrate de habilitar XMP en la BIOS.',
              author: 'Ana Martinez',
              authorType: 'support',
              timestamp: '2024-11-28T16:45:00Z'
            }
          ]
        },
        {
          id: 'TKT-003',
          subject: 'Problema de envío - pedido #12345',
          description: 'Mi pedido no ha llegado y ya pasaron 7 días de la fecha estimada de entrega',
          status: 'open',
          priority: 'urgent',
          category: 'Envío',
          customerName: 'Carlos López',
          customerEmail: 'carlos@email.com',
          createdAt: '2024-12-02T08:30:00Z',
          updatedAt: '2024-12-02T08:30:00Z',
          messages: []
        }
      ]);
  }, []);

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
    resolvedToday: tickets.filter(t => 
      t.status === 'resolved' && 
      new Date(t.updatedAt).toDateString() === new Date().toDateString()
    ).length
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;

    const message: SupportMessage = {
      id: `MSG-${Date.now()}`,
      content: newMessage,
      author: getUserDisplayName(),
      authorType: 'support',
      timestamp: new Date().toISOString()
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, message],
      updatedAt: new Date().toISOString()
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    setNewMessage('');
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
        : ticket
    ));
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Debes iniciar sesión para acceder al panel de soporte
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Panel de Soporte Técnico</h1>
            <p className="text-muted-foreground text-lg">
              Bienvenido, {getUserDisplayName()} - Gestiona tickets de soporte y chat con clientes
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1 bg-green-100 text-green-800">
            Soporte
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">
            <CheckCircle className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <MessageCircle className="w-4 h-4 mr-2" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat en Vivo
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tickets</p>
                    <p className="text-2xl font-bold">{stats.totalTickets}</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tickets Abiertos</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.openTickets}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">En Progreso</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.inProgressTickets}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resueltos Hoy</p>
                    <p className="text-2xl font-bold text-green-600">{stats.resolvedToday}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tickets por Prioridad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['urgent', 'high', 'medium', 'low'].map(priority => {
                  const count = tickets.filter(t => t.priority === priority).length;
                  return (
                    <div key={priority} className="flex items-center justify-between p-2 border rounded">
                      <Badge className={getPriorityColor(priority as any)}>
                        {priority.toUpperCase()}
                      </Badge>
                      <span>{count} tickets</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tickets */}
        <TabsContent value="tickets" className="space-y-6">
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Buscar tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="open">Abiertos</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="resolved">Resueltos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lista de tickets */}
            <div className="lg:col-span-1 space-y-4">
              {filteredTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className={`cursor-pointer transition-shadow hover:shadow-md ${
                    selectedTicket?.id === ticket.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{ticket.subject}</h3>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{ticket.customerName}</p>
                    <div className="flex items-center justify-between">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detalles del ticket */}
            <div className="lg:col-span-2">
              {selectedTicket ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{selectedTicket.subject}</CardTitle>
                        <p className="text-muted-foreground">
                          {selectedTicket.customerName} ({selectedTicket.customerEmail})
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={selectedTicket.status}
                          onValueChange={(value) => handleUpdateTicketStatus(selectedTicket.id, value as any)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Abierto</SelectItem>
                            <SelectItem value="in_progress">En Progreso</SelectItem>
                            <SelectItem value="resolved">Resuelto</SelectItem>
                            <SelectItem value="closed">Cerrado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-4 bg-muted rounded-lg">
                      <p className="text-sm">{selectedTicket.description}</p>
                    </div>

                    {/* Conversación */}
                    <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                      {selectedTicket.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg ${
                            message.authorType === 'support'
                              ? 'bg-primary/10 ml-8'
                              : 'bg-muted mr-8'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{message.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Responder */}
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        className="min-h-[80px]"
                      />
                      <Button type="submit" disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Selecciona un ticket para ver los detalles
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Chat */}
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat en Vivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Sistema de chat en vivo en desarrollo...
                </p>
                <p className="text-sm text-muted-foreground">
                  Próximamente podrás chatear en tiempo real con los clientes
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
