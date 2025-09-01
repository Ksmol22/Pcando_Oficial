import React from 'react';
import { Building2, Users, Target, Award, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Company() {
  const stats = [
    { label: 'Clientes Satisfechos', value: '50,000+', icon: Users },
    { label: 'Productos en Stock', value: '15,000+', icon: Building2 },
    { label: 'Años de Experiencia', value: '12+', icon: Calendar },
    { label: 'Ciudades Atendidas', value: '200+', icon: MapPin }
  ];

  const team = [
    {
      name: 'Carlos Rodríguez',
      position: 'CEO & Fundador',
      image: '/images/team/carlos.jpg',
      bio: 'Ingeniero en sistemas con 15 años de experiencia en el sector tecnológico.'
    },
    {
      name: 'Ana Martínez',
      position: 'Directora de Tecnología',
      image: '/images/team/ana.jpg',
      bio: 'Especialista en hardware con certificaciones de Intel, AMD y NVIDIA.'
    },
    {
      name: 'Luis García',
      position: 'Gerente de Ventas',
      image: '/images/team/luis.jpg',
      bio: 'Experto en atención al cliente con enfoque en soluciones personalizadas.'
    },
    {
      name: 'María López',
      position: 'Directora de Soporte',
      image: '/images/team/maria.jpg',
      bio: 'Lidera nuestro equipo de soporte técnico con más de 10 años de experiencia.'
    }
  ];

  const certifications = [
    'Intel Gold Partner',
    'AMD Elite Partner',
    'NVIDIA Elite Partner',
    'Microsoft Gold Partner',
    'ISO 9001:2015',
    'Certificación de Calidad'
  ];

  const values = [
    {
      title: 'Calidad',
      description: 'Ofrecemos solo productos de la más alta calidad de marcas reconocidas.',
      icon: Award
    },
    {
      title: 'Innovación',
      description: 'Nos mantenemos a la vanguardia de la tecnología más reciente.',
      icon: Target
    },
    {
      title: 'Servicio',
      description: 'Brindamos soporte técnico excepcional antes, durante y después de la venta.',
      icon: Users
    },
    {
      title: 'Confianza',
      description: 'Construimos relaciones duraderas basadas en transparencia y honestidad.',
      icon: Building2
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Sobre PCando Oficial</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Somos la empresa líder en venta de componentes de PC en Latinoamérica, 
          comprometidos con brindar la mejor experiencia tecnológica a nuestros clientes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Nuestra Historia */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-3xl font-bold mb-4">Nuestra Historia</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Fundada en 2012, PCando Oficial nació de la pasión por la tecnología y el deseo 
              de democratizar el acceso a componentes de PC de alta calidad en Latinoamérica.
            </p>
            <p>
              Lo que comenzó como una pequeña tienda local se ha convertido en la plataforma 
              de e-commerce más confiable para entusiastas de PC, gamers y profesionales.
            </p>
            <p>
              Hoy en día, servimos a más de 50,000 clientes en toda la región, manteniendo 
              nuestro compromiso original: calidad, servicio y precios justos.
            </p>
          </div>
        </div>
        <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
          <Building2 className="w-32 h-32 text-muted-foreground" />
        </div>
      </div>

      {/* Valores */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Nuestros Valores</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Equipo */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Nuestro Equipo</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.position}</p>
                <p className="text-xs text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Certificaciones */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Certificaciones y Alianzas</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {certifications.map((cert, index) => (
            <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
              {cert}
            </Badge>
          ))}
        </div>
      </div>

      {/* Contacto Empresarial */}
      <div className="bg-muted rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Contacto Empresarial</h2>
          <p className="text-muted-foreground">
            ¿Tienes una consulta empresarial o quieres formar una alianza? Contáctanos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Teléfono Empresarial</h3>
              <p className="text-muted-foreground">+1 (555) 987-6543</p>
              <p className="text-xs text-muted-foreground mt-1">Lun-Vie 8:00-19:00</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Email Empresarial</h3>
              <p className="text-muted-foreground">empresas@pcando.com</p>
              <p className="text-xs text-muted-foreground mt-1">Respuesta en 12h</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Oficinas Principales</h3>
              <p className="text-muted-foreground">Av. Tecnología 123</p>
              <p className="text-muted-foreground">Ciudad Tech, CT 12345</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button size="lg">Contactar Ventas Empresariales</Button>
        </div>
      </div>

      {/* Responsabilidad Social */}
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Compromiso Social</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
          Estamos comprometidos con el desarrollo tecnológico de nuestras comunidades. 
          Participamos en programas educativos, donamos equipos a escuelas y apoyamos 
          iniciativas que promueven la inclusión digital.
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="outline" className="py-2 px-4">
            Programa Escuelas Digitales
          </Badge>
          <Badge variant="outline" className="py-2 px-4">
            Becas Tecnológicas
          </Badge>
          <Badge variant="outline" className="py-2 px-4">
            Reciclaje Responsable
          </Badge>
        </div>
      </div>
    </div>
  );
}
