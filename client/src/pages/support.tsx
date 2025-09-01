import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Mail, Clock, User, Search, Filter, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
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

export default function Support() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('contact');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium' as const
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Datos de ejemplo para tickets
  useEffect(() => {
    if (isAuthenticated) {
      setTickets([
        {
          id: 'TKT-001',
          subject: 'Problema con la tarjeta gráfica RTX 4090',
          description: 'Mi tarjeta gráfica no se reconoce correctamente en el sistema',
          status: 'in_progress',
          priority: 'high',
          category: 'Hardware',
          createdAt: '2024-12-01T10:00:00Z',
          updatedAt: '2024-12-01T14:30:00Z',
          assignedTo: 'Carlos Rodriguez',
          messages: [
            {
              id: 'MSG-001',
              content: 'Hola, tengo un problema con mi tarjeta gráfica nueva. No aparece en el administrador de dispositivos.',
              author: user?.name || 'Usuario',
              authorType: 'customer',
              timestamp: '2024-12-01T10:00:00Z'
            },
            {
              id: 'MSG-002',
              content: 'Hola! Gracias por contactarnos. ¿Podrías verificar que la tarjeta esté correctamente conectada a la fuente de poder?',
              author: 'Carlos Rodriguez',
              authorType: 'support',
              timestamp: '2024-12-01T14:30:00Z'
            }
          ]
        },
        {
          id: 'TKT-002',
          subject: 'Consulta sobre compatibilidad de RAM',
          description: 'Quiero saber si la RAM DDR5-6000 es compatible con mi motherboard',
          status: 'resolved',
          priority: 'medium',
          category: 'Consulta',
          createdAt: '2024-11-28T09:15:00Z',
          updatedAt: '2024-11-28T16:45:00Z',
          assignedTo: 'Ana Martinez',
          messages: []
        }
      ]);
    }
  }, [isAuthenticated, user]);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para crear un ticket de soporte');
      return;
    }

    const ticket: SupportTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      ...newTicket,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: '', description: '', category: '', priority: 'medium' });
    setActiveTab('tickets');
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Centro de Soporte</h1>
        <p className="text-muted-foreground text-lg">
          Estamos aquí para ayudarte con cualquier duda o problema que tengas
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contact">
            <MessageCircle className="w-4 h-4 mr-2" />
            Contacto
          </TabsTrigger>
          <TabsTrigger value="faq">
            <Search className="w-4 h-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tickets">
            <Clock className="w-4 h-4 mr-2" />
            Mis Tickets
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat en Vivo
          </TabsTrigger>
        </TabsList>

        {/* Contacto */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Crear Ticket de Soporte</CardTitle>
              </CardHeader>
              <CardContent>
                {!isAuthenticated ? (
                  <Alert className="mb-4">
                    <AlertDescription>
                      Debes <Button variant="link" className="p-0 h-auto">iniciar sesión</Button> para crear un ticket de soporte
                    </AlertDescription>
                  </Alert>
                ) : null}

                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Asunto</label>
                    <Input
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      placeholder="Describe brevemente tu problema"
                      required
                      disabled={!isAuthenticated}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Categoría</label>
                    <Select 
                      value={newTicket.category} 
                      onValueChange={(value) => setNewTicket({...newTicket, category: value})}
                      disabled={!isAuthenticated}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hardware">Problema de Hardware</SelectItem>
                        <SelectItem value="Software">Problema de Software</SelectItem>
                        <SelectItem value="Pedido">Consulta sobre Pedido</SelectItem>
                        <SelectItem value="Garantia">Garantía</SelectItem>
                        <SelectItem value="Consulta">Consulta General</SelectItem>
                        <SelectItem value="Devolucion">Devolución/Cambio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Prioridad</label>
                    <Select 
                      value={newTicket.priority} 
                      onValueChange={(value) => setNewTicket({...newTicket, priority: value as any})}
                      disabled={!isAuthenticated}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Descripción</label>
                    <Textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      placeholder="Describe detalladamente tu problema o consulta"
                      rows={4}
                      required
                      disabled={!isAuthenticated}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={!isAuthenticated}>
                    Crear Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Otros Canales de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-xs text-muted-foreground">Lun-Vie 9:00-18:00</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">soporte@pcando.com</p>
                    <p className="text-xs text-muted-foreground">Respuesta en 24h</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Chat en Vivo</p>
                    <p className="text-sm text-muted-foreground">Disponible ahora</p>
                    <Button size="sm" className="mt-1">Iniciar Chat</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <div className="mb-4">
            <Input
              placeholder="Buscar en preguntas frecuentes..."
              className="max-w-md"
            />
          </div>

          <div className="space-y-4">
            {[
              {
                q: "¿Cuánto tiempo tarda en llegar mi pedido?",
                a: "Los pedidos estándar tardan entre 3-5 días hábiles. Los envíos express llegan en 1-2 días."
              },
              {
                q: "¿Qué garantía tienen los productos?",
                a: "Todos nuestros productos tienen garantía del fabricante. Los componentes principales tienen 2-3 años de garantía."
              },
              {
                q: "¿Puedo cambiar o devolver un producto?",
                a: "Sí, tienes 30 días para devolver productos en perfecto estado. Los componentes usados no son elegibles."
              },
              {
                q: "¿Ofrecen servicio de armado de PC?",
                a: "Sí, ofrecemos servicio de armado profesional por $99. Incluye instalación de Windows y pruebas."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader className="cursor-pointer">
                  <CardTitle className="text-base flex items-center justify-between">
                    {faq.q}
                    <ChevronDown className="w-4 h-4" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tickets */}
        <TabsContent value="tickets" className="space-y-6">
          {!isAuthenticated ? (
            <Alert>
              <AlertDescription>
                Debes iniciar sesión para ver tus tickets de soporte
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Buscar tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="open">Abiertos</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="resolved">Resueltos</SelectItem>
                    <SelectItem value="closed">Cerrados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{ticket.subject}</h3>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>#{ticket.id}</span>
                            <span>{ticket.category}</span>
                            <span>Creado: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                            {ticket.assignedTo && <span>Asignado a: {ticket.assignedTo}</span>}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Chat */}
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat en Vivo</CardTitle>
            </CardHeader>
            <CardContent>
              {!isAuthenticated ? (
                <Alert>
                  <AlertDescription>
                    Debes iniciar sesión para usar el chat en vivo
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Conecta con un agente de soporte en tiempo real
                  </p>
                  <Button>Iniciar Chat</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
