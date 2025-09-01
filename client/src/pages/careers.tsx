import React from 'react';
import { Briefcase, MapPin, Clock, Users, TrendingUp, Heart, ArrowRight, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Careers() {
  const openPositions = [
    {
      title: "Especialista en Hardware Senior",
      department: "Técnico",
      location: "CDMX - Híbrido",
      type: "Tiempo Completo",
      experience: "3-5 años",
      description: "Buscamos un experto en componentes gaming para asesorar clientes y optimizar configuraciones.",
      requirements: ["Experiencia con componentes gaming", "Conocimientos de overclocking", "Atención al cliente"],
      benefits: ["Seguro de gastos médicos", "Descuentos en productos", "Capacitación continua"]
    },
    {
      title: "Desarrollador Full Stack",
      department: "Tecnología",
      location: "Remoto",
      type: "Tiempo Completo",
      experience: "2-4 años",
      description: "Únete a nuestro equipo tech para desarrollar la próxima generación de herramientas gaming.",
      requirements: ["React/TypeScript", "Node.js", "Bases de datos SQL"],
      benefits: ["100% remoto", "Equipos de última generación", "Flexibilidad horaria"]
    },
    {
      title: "Account Manager Corporativo",
      department: "Ventas",
      location: "GDL - Presencial",
      type: "Tiempo Completo",
      experience: "3-6 años",
      description: "Gestiona cuentas empresariales y desarrolla nuevas oportunidades B2B.",
      requirements: ["Experiencia B2B", "CRM management", "Inglés avanzado"],
      benefits: ["Comisiones atractivas", "Carro de la empresa", "Plan de carrera"]
    },
    {
      title: "Community Manager Gaming",
      department: "Marketing",
      location: "MTY - Híbrido",
      type: "Tiempo Completo",
      experience: "1-3 años",
      description: "Conecta con nuestra comunidad gamer y crea contenido que inspire.",
      requirements: ["Gaming enthusiast", "Redes sociales", "Creación de contenido"],
      benefits: ["Setup gaming completo", "Flexibilidad creativa", "Eventos gaming"]
    },
    {
      title: "Técnico de Ensamblaje",
      department: "Operaciones",
      location: "CDMX - Presencial",
      type: "Tiempo Completo",
      experience: "1-2 años",
      description: "Ensambla sistemas gaming premium con los más altos estándares de calidad.",
      requirements: ["Experiencia en ensamblaje", "Conocimientos básicos de PC", "Atención al detalle"],
      benefits: ["Capacitación especializada", "Herramientas profesionales", "Ambiente dinámico"]
    },
    {
      title: "Pasante de Marketing Digital",
      department: "Marketing",
      location: "Remoto",
      type: "Pasantía",
      experience: "Estudiante",
      description: "Aprende marketing digital en el mundo gaming mientras estudias.",
      requirements: ["Estudiante activo", "Interés en gaming", "Conocimientos básicos de marketing"],
      benefits: ["Experiencia práctica", "Mentoring personalizado", "Posibilidad de contratación"]
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Salud y Bienestar",
      items: ["Seguro de gastos médicos mayor", "Seguro de vida", "Apoyo psicológico", "Días de salud mental"]
    },
    {
      icon: TrendingUp,
      title: "Crecimiento Profesional",
      items: ["Plan de carrera definido", "Capacitación continua", "Certificaciones pagadas", "Mentoring interno"]
    },
    {
      icon: Users,
      title: "Ambiente de Trabajo",
      items: ["Equipos de última generación", "Espacios gaming", "Eventos de team building", "Cultura gamer"]
    },
    {
      icon: Briefcase,
      title: "Beneficios Económicos",
      items: ["Sueldo competitivo", "Bonos por objetivos", "Descuentos en productos", "Vales de despensa"]
    }
  ];

  const companyPerks = [
    "🎮 Setup gaming completo para trabajar",
    "🏠 Modalidad híbrida o remota",
    "📚 Budget anual para capacitación",
    "🎉 Gaming nights mensuales",
    "🏆 Torneos internos de esports",
    "☕ Café ilimitado y snacks",
    "🌴 Días adicionales de vacaciones",
    "🚀 Stock options para seniors"
  ];

  const culture = [
    {
      title: "Gaming First",
      description: "Somos gamers reales trabajando para gamers reales. Entendemos la pasión porque la vivimos.",
      icon: "🎮"
    },
    {
      title: "Innovación Constante",
      description: "Siempre buscamos la próxima gran idea. Tu creatividad tiene espacio para brillar.",
      icon: "🚀"
    },
    {
      title: "Crecimiento Juntos",
      description: "Tu éxito es nuestro éxito. Invertimos en tu desarrollo profesional y personal.",
      icon: "📈"
    },
    {
      title: "Diversidad e Inclusión",
      description: "Celebramos las diferencias. Todos los gamers tienen lugar en nuestro equipo.",
      icon: "🌈"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Únete al Equipo</h1>
        <p className="text-muted-foreground text-lg">
          Construye tu carrera en la empresa gaming líder de América Latina
        </p>
      </div>

      <Tabs defaultValue="positions" className="space-y-8">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="positions">Posiciones Abiertas</TabsTrigger>
          <TabsTrigger value="benefits">Beneficios</TabsTrigger>
          <TabsTrigger value="culture">Cultura</TabsTrigger>
          <TabsTrigger value="process">Proceso</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-6">
          <div className="grid gap-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">{position.department}</Badge>
                        <Badge variant="outline">
                          <MapPin className="w-3 h-3 mr-1" />
                          {position.location}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="w-3 h-3 mr-1" />
                          {position.type}
                        </Badge>
                        <Badge variant="outline">
                          <Star className="w-3 h-3 mr-1" />
                          {position.experience}
                        </Badge>
                      </div>
                    </div>
                    <Button>
                      Aplicar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{position.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Requisitos:</h4>
                      <ul className="space-y-1">
                        {position.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Beneficios:</h4>
                      <ul className="space-y-1">
                        {position.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Extras:</h4>
                      <div className="space-y-1 text-muted-foreground">
                        <p>Revisión salarial anual</p>
                        <p>Oportunidad de crecimiento</p>
                        <p>Proyectos innovadores</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="benefits">
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <category.icon className="w-5 h-5 text-primary" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.items.map((item, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Perks Especiales de PC Ando</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {companyPerks.map((perk, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                      {perk}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="culture">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Nuestra Cultura Gaming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {culture.map((item, index) => (
                    <div key={index} className="p-6 border rounded-lg">
                      <div className="text-4xl mb-3">{item.icon}</div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Un Día en PC Ando</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge>9:00 AM</Badge>
                    <span>Daily standup con café y gaming news</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge>10:00 AM</Badge>
                    <span>Deep work con tu setup gaming personalizado</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge>12:30 PM</Badge>
                    <span>Almuerzo en nuestro gaming lounge</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge>2:00 PM</Badge>
                    <span>Colaboración en proyectos innovadores</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge>4:00 PM</Badge>
                    <span>Learning hour - nuevas tecnologías</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge>6:00 PM</Badge>
                    <span>Gaming session opcional con el equipo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="process">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Proceso de Selección</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Aplicación Online</h3>
                      <p className="text-muted-foreground text-sm">Envía tu CV y carta de presentación a través de nuestra plataforma</p>
                      <Badge variant="outline" className="mt-1">24-48hrs respuesta</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Screening Telefónico</h3>
                      <p className="text-muted-foreground text-sm">Conversación inicial con nuestro equipo de talent acquisition</p>
                      <Badge variant="outline" className="mt-1">30 minutos</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold">Entrevista Técnica</h3>
                      <p className="text-muted-foreground text-sm">Evaluación de conocimientos específicos del rol</p>
                      <Badge variant="outline" className="mt-1">60 minutos</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold">Entrevista Cultural</h3>
                      <p className="text-muted-foreground text-sm">Conoce al equipo y evalúa fit cultural</p>
                      <Badge variant="outline" className="mt-1">45 minutos</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                      5
                    </div>
                    <div>
                      <h3 className="font-semibold">Oferta y Onboarding</h3>
                      <p className="text-muted-foreground text-sm">¡Bienvenido al equipo! Proceso de integración completo</p>
                      <Badge variant="outline" className="mt-1">Primera semana</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tips para tu Aplicación</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2"></span>
                      Personaliza tu CV para la posición específica
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2"></span>
                      Menciona tu pasión por gaming si es relevante
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2"></span>
                      Incluye proyectos que demuestren tus skills
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full mt-2"></span>
                      Sé auténtico en tu carta de presentación
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contacto Recruiting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p><strong>Email:</strong> careers@pcando.com</p>
                    <p><strong>LinkedIn:</strong> /company/pcando-tech</p>
                    <p><strong>Teléfono:</strong> +52 (55) 1234-5678 ext. 105</p>
                    <p className="text-muted-foreground">
                      Horarios de atención: Lun-Vie 9:00-18:00
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
