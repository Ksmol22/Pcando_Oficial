import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, Building, Globe, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Contact() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Teléfono",
      details: "+1 (555) 123-4567",
      description: "Lun-Dom: 8:00 AM - 10:00 PM",
      action: "Llamar Ahora"
    },
    {
      icon: Mail,
      title: "Email",
      details: "contacto@pcando.com",
      description: "Respuesta en 24 horas",
      action: "Enviar Email"
    },
    {
      icon: MessageCircle,
      title: "Chat en Vivo",
      details: "Soporte instantáneo",
      description: "Disponible 24/7",
      action: "Iniciar Chat"
    },
    {
      icon: MapPin,
      title: "Oficina Principal",
      details: "Av. Tecnológica 123, CDMX",
      description: "Lun-Vie: 9:00 AM - 6:00 PM",
      action: "Ver Ubicación"
    }
  ];

  const offices = [
    {
      city: "Ciudad de México",
      address: "Av. Tecnológica 123, Piso 5\nPolanco, CDMX 01234",
      phone: "+52 (55) 1234-5678",
      email: "cdmx@pcando.com",
      hours: "Lun-Vie: 9:00-18:00\nSáb: 10:00-14:00"
    },
    {
      city: "Guadalajara",
      address: "Av. Américas 456, Piso 3\nProvindencia, GDL 44567",
      phone: "+52 (33) 1234-5678",
      email: "gdl@pcando.com",
      hours: "Lun-Vie: 9:00-18:00\nSáb: 10:00-14:00"
    },
    {
      city: "Monterrey",
      address: "Av. Constitución 789, Piso 2\nCentro, MTY 67890",
      phone: "+52 (81) 1234-5678",
      email: "mty@pcando.com",
      hours: "Lun-Vie: 9:00-18:00\nSáb: 10:00-14:00"
    }
  ];

  const departments = [
    { value: "ventas", label: "Ventas y Cotizaciones" },
    { value: "soporte", label: "Soporte Técnico" },
    { value: "garantias", label: "Garantías y RMA" },
    { value: "corporativo", label: "Ventas Corporativas" },
    { value: "partnerships", label: "Partnerships" },
    { value: "prensa", label: "Prensa y Media" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Contacto</h1>
        <p className="text-muted-foreground text-lg">
          Estamos aquí para ayudarte. Elige el canal que prefieras
        </p>
      </div>

      {/* Métodos de contacto principales */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {contactMethods.map((method, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <method.icon className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{method.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium mb-1">{method.details}</p>
              <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                {method.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Formulario de contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Envíanos un Mensaje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" placeholder="Tu nombre" />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" placeholder="Tu apellido" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" />
              </div>

              <div>
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <Input id="phone" placeholder="+52 (555) 123-4567" />
              </div>

              <div>
                <Label htmlFor="department">Departamento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Asunto</Label>
                <Input id="subject" placeholder="¿En qué podemos ayudarte?" />
              </div>

              <div>
                <Label htmlFor="message">Mensaje</Label>
                <Textarea 
                  id="message" 
                  rows={4}
                  placeholder="Describe tu consulta o proyecto..."
                />
              </div>

              <Button className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Típicamente respondemos en menos de 24 horas
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Oficinas */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Nuestras Oficinas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{office.city}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <span className="whitespace-pre-line">{office.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{office.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{office.email}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <span className="whitespace-pre-line">{office.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Información Corporativa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Razón Social</h4>
                <p className="text-sm text-muted-foreground">
                  PC Ando Technologies S.A. de C.V.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">RFC</h4>
                <p className="text-sm text-muted-foreground">
                  PCT123456789
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Registro Mercantil</h4>
                <p className="text-sm text-muted-foreground">
                  RM-CDMX-2020-001234
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-1">Certificaciones</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="px-2 py-1 bg-muted rounded text-xs">ISO 9001</span>
                  <span className="px-2 py-1 bg-muted rounded text-xs">Partner Intel</span>
                  <span className="px-2 py-1 bg-muted rounded text-xs">Partner AMD</span>
                  <span className="px-2 py-1 bg-muted rounded text-xs">Partner NVIDIA</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Departamentos Especializados
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Ventas Corporativas:</span>
                    <span>ext. 101</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Soporte Técnico:</span>
                    <span>ext. 102</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Garantías:</span>
                    <span>ext. 103</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Partnerships:</span>
                    <span>ext. 104</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
