import React from 'react';
import { Users, Target, Award, Globe, Calendar, TrendingUp, Heart, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutUs() {
  const milestones = [
    {
      year: "2018",
      title: "Fundación",
      description: "Inicio de PC Ando con una visión clara: democratizar la tecnología gaming en América Latina"
    },
    {
      year: "2019",
      title: "Expansión Nacional",
      description: "Apertura de oficinas en Guadalajara y Monterrey, llegando a más gamers mexicanos"
    },
    {
      year: "2020",
      title: "Digitalización",
      description: "Lanzamiento de plataforma e-commerce y sistema de configuración automática"
    },
    {
      year: "2021",
      title: "Partnerships Estratégicos",
      description: "Alianzas directas con Intel, AMD, NVIDIA y principales fabricantes"
    },
    {
      year: "2022",
      title: "Certificación ISO",
      description: "Obtención de certificación ISO 9001 en calidad y procesos"
    },
    {
      year: "2023",
      title: "Expansión Internacional",
      description: "Inicio de operaciones en Colombia y planes para toda Latinoamérica"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Pasión por Gaming",
      description: "Somos gamers construyendo para gamers. Entendemos tus necesidades porque las vivimos."
    },
    {
      icon: Award,
      title: "Calidad Premium",
      description: "Solo trabajamos con componentes de primera calidad respaldados por garantías completas."
    },
    {
      icon: Lightbulb,
      title: "Innovación Constante",
      description: "Siempre buscamos nuevas formas de mejorar tu experiencia de compra y gaming."
    },
    {
      icon: Users,
      title: "Comunidad Primero",
      description: "Construimos una comunidad donde cada gamer encuentra su lugar y apoyo."
    },
    {
      icon: Globe,
      title: "Accesibilidad Global",
      description: "Tecnología de punta accesible para gamers de todo nivel económico."
    },
    {
      icon: TrendingUp,
      title: "Crecimiento Sostenible",
      description: "Crecemos de manera responsable, siempre pensando en nuestros clientes."
    }
  ];

  const stats = [
    { number: "50,000+", label: "PCs Construidas", description: "Sistemas ensamblados y entregados" },
    { number: "98.5%", label: "Satisfacción", description: "Clientes satisfechos con su compra" },
    { number: "72hrs", label: "Tiempo Promedio", description: "De ensamblaje y envío" },
    { number: "24/7", label: "Soporte", description: "Atención técnica continua" }
  ];

  const team = [
    {
      name: "Carlos Mendoza",
      position: "CEO & Founder",
      background: "Ex-Intel, 15 años en tecnología",
      specialty: "Estrategia y Visión Corporativa"
    },
    {
      name: "Ana Rodríguez",
      position: "CTO",
      background: "Ex-NVIDIA, Ingeniera en Sistemas",
      specialty: "Desarrollo Tecnológico"
    },
    {
      name: "Luis García",
      position: "Head of Gaming",
      background: "Pro Gamer, Streamer",
      specialty: "Experiencia de Usuario Gaming"
    },
    {
      name: "María López",
      position: "Directora de Calidad",
      background: "Ex-AMD, Certificación ISO",
      specialty: "Control de Calidad y Procesos"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Sobre Nosotros</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Somos más que una tienda de componentes. Somos una comunidad de gamers 
          apasionados por llevar la mejor tecnología a cada rincón de América Latina.
        </p>
      </div>

      {/* Misión y Visión */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Nuestra Misión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Democratizar el acceso a tecnología gaming de alta calidad en América Latina, 
              proporcionando componentes premium, asesoría experta y soporte excepcional para 
              que cada gamer pueda construir la PC de sus sueños.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Nuestra Visión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ser la plataforma líder en América Latina para gaming y tecnología, 
              reconocida por nuestra comunidad como el destino preferido para construir, 
              actualizar y mantener sistemas gaming de alto rendimiento.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-center">Nuestro Impacto en Números</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Valores */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Nuestros Valores</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Nuestra Historia</h2>
        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Badge variant="secondary" className="text-sm font-semibold">
                  {milestone.year}
                </Badge>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{milestone.title}</h3>
                <p className="text-muted-foreground">{milestone.description}</p>
                {index < milestones.length - 1 && (
                  <div className="mt-4 h-8 w-0.5 bg-border ml-8"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipo */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Nuestro Equipo</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-lg text-center">{member.name}</CardTitle>
                <p className="text-sm text-primary text-center font-medium">{member.position}</p>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{member.background}</p>
                <Badge variant="outline" className="text-xs">{member.specialty}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Certificaciones y Partners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certificaciones y Partners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Certificaciones</h4>
              <div className="space-y-2">
                <Badge variant="secondary">ISO 9001:2015 - Gestión de Calidad</Badge>
                <Badge variant="secondary">ISO 27001 - Seguridad de la Información</Badge>
                <Badge variant="secondary">Certificación AMITI</Badge>
                <Badge variant="secondary">Registro ante PROFECO</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Partners Oficiales</h4>
              <div className="space-y-2">
                <Badge variant="outline">Intel Premier Partner</Badge>
                <Badge variant="outline">AMD Partner</Badge>
                <Badge variant="outline">NVIDIA Elite Partner</Badge>
                <Badge variant="outline">ASUS ROG Partner</Badge>
                <Badge variant="outline">MSI Gaming Partner</Badge>
                <Badge variant="outline">Corsair Premium Partner</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
