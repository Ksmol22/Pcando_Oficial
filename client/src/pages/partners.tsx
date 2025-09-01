import React from 'react';
import { Handshake, Building2, Users, Target, TrendingUp, Globe, Award, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Partners() {
  const currentPartners = [
    {
      category: "Hardware Partners",
      partners: [
        {
          name: "Intel",
          logo: "🔷",
          tier: "Premier Partner",
          description: "Procesadores de última generación y tecnología gaming avanzada",
          benefits: ["Acceso anticipado a nuevos productos", "Soporte técnico especializado", "Programas de marketing conjunto"]
        },
        {
          name: "NVIDIA",
          logo: "🟢",
          tier: "Elite Partner",
          description: "Tarjetas gráficas RTX y tecnologías de ray tracing",
          benefits: ["Inventario prioritario RTX", "Certificación GeForce Partner", "Eventos exclusivos"]
        },
        {
          name: "AMD",
          logo: "🔴",
          tier: "Gold Partner",
          description: "Procesadores Ryzen y tarjetas gráficas Radeon",
          benefits: ["Descuentos especiales", "Soporte técnico directo", "Programas de training"]
        }
      ]
    },
    {
      category: "Distribution Partners",
      partners: [
        {
          name: "Tech Data",
          logo: "📦",
          tier: "Preferred Distributor",
          description: "Distribución y logística en América Latina",
          benefits: ["Cobertura regional", "Gestión de inventario", "Financiamiento flexible"]
        },
        {
          name: "Ingram Micro",
          logo: "🌐",
          tier: "Strategic Partner",
          description: "Soluciones de cadena de suministro global",
          benefits: ["Alcance internacional", "Servicios de valor agregado", "Soporte logístico"]
        }
      ]
    },
    {
      category: "Technology Partners",
      partners: [
        {
          name: "Microsoft Azure",
          logo: "☁️",
          tier: "Cloud Partner",
          description: "Infraestructura cloud y servicios de IA",
          benefits: ["Créditos Azure", "Soporte técnico premium", "Programas de desarrollo conjunto"]
        },
        {
          name: "Shopify Plus",
          logo: "🛒",
          tier: "Platform Partner",
          description: "Plataforma de e-commerce empresarial",
          benefits: ["Funcionalidades avanzadas", "Soporte prioritario", "Integraciones especializadas"]
        }
      ]
    }
  ];

  const partnerPrograms = [
    {
      title: "Reseller Partner Program",
      icon: Building2,
      description: "Para empresas que desean revender nuestros productos y soluciones",
      requirements: [
        "Registro mercantil activo",
        "Experiencia en venta de tecnología",
        "Capacidad de inventario mínima",
        "Equipo de ventas certificado"
      ],
      benefits: [
        "Márgenes competitivos",
        "Soporte técnico y comercial",
        "Material de marketing",
        "Territorio protegido"
      ],
      investment: "Inversión inicial: $50,000 - $200,000 MXN"
    },
    {
      title: "Technology Partner Program",
      icon: Target,
      description: "Para empresas de software y servicios tecnológicos",
      requirements: [
        "Producto o servicio complementario",
        "API o integración técnica",
        "Equipo de desarrollo activo",
        "Referencias de clientes"
      ],
      benefits: [
        "Integración en nuestra plataforma",
        "Co-marketing opportunities",
        "Revenue sharing",
        "Desarrollo conjunto"
      ],
      investment: "Inversión técnica y recursos de desarrollo"
    },
    {
      title: "Affiliate Program",
      icon: Users,
      description: "Para influencers, streamers y creadores de contenido gaming",
      requirements: [
        "Audiencia gaming activa",
        "Contenido regular de calidad",
        "Engagement rate mínimo",
        "Alineación con nuestros valores"
      ],
      benefits: [
        "Comisiones por venta",
        "Productos para review",
        "Códigos de descuento exclusivos",
        "Invitaciones a eventos"
      ],
      investment: "Sin inversión inicial requerida"
    }
  ];

  const partnerBenefits = [
    {
      icon: TrendingUp,
      title: "Crecimiento Conjunto",
      description: "Acceso a mercados y oportunidades de crecimiento mutuo"
    },
    {
      icon: Award,
      title: "Certificaciones",
      description: "Programas de certificación y reconocimientos oficiales"
    },
    {
      icon: Globe,
      title: "Alcance Global",
      description: "Expansión a mercados internacionales con nuestro respaldo"
    },
    {
      icon: Handshake,
      title: "Soporte Dedicado",
      description: "Account manager asignado y soporte técnico especializado"
    }
  ];

  const successStories = [
    {
      partner: "GameZone México",
      category: "Reseller",
      result: "300% incremento en ventas gaming",
      story: "Desde nuestra alianza, GameZone ha triplicado sus ventas de componentes gaming y expandido a 5 ciudades nuevas.",
      metrics: ["300% más ventas", "5 nuevas ubicaciones", "98% satisfacción"]
    },
    {
      partner: "StreamLabs LATAM",
      category: "Technology",
      result: "Integración exitosa de configuraciones automáticas",
      story: "La integración con StreamLabs permite a streamers obtener builds optimizadas para broadcasting con un click.",
      metrics: ["50K+ configuraciones", "45% tiempo reducido", "4.9⭐ rating"]
    },
    {
      partner: "GamerInfluencer",
      category: "Affiliate",
      result: "$500K+ en ventas generadas",
      story: "Nuestro programa de afiliados ha permitido a creators generar ingresos significativos mientras educan a su audiencia.",
      metrics: ["$500K+ revenue", "2M+ impresiones", "15% conversion rate"]
    }
  ];

  const applicationSteps = [
    {
      step: 1,
      title: "Solicitud Inicial",
      description: "Completa nuestro formulario de partnership con información de tu empresa",
      duration: "5-10 minutos"
    },
    {
      step: 2,
      title: "Evaluación",
      description: "Nuestro equipo evalúa tu solicitud y fit estratégico",
      duration: "3-5 días hábiles"
    },
    {
      step: 3,
      title: "Presentación",
      description: "Reunión para conocer tu empresa y discutir oportunidades",
      duration: "60 minutos"
    },
    {
      step: 4,
      title: "Negociación",
      description: "Definición de términos, condiciones y estructura del partnership",
      duration: "1-2 semanas"
    },
    {
      step: 5,
      title: "Onboarding",
      description: "Proceso de integración y capacitación del equipo",
      duration: "2-4 semanas"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Partners</h1>
        <p className="text-muted-foreground text-lg">
          Construimos el ecosistema gaming del futuro junto a los mejores aliados
        </p>
      </div>

      {/* Partners actuales */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Nuestros Partners Estratégicos</h2>
        <div className="space-y-8">
          {currentPartners.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.partners.map((partner, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-3xl">{partner.logo}</div>
                        <div>
                          <CardTitle className="text-lg">{partner.name}</CardTitle>
                          <Badge variant="secondary">{partner.tier}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{partner.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {partner.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Programas de partnership */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Programas de Partnership</h2>
        <div className="grid lg:grid-cols-3 gap-8">
          {partnerPrograms.map((program, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <program.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{program.title}</CardTitle>
                <p className="text-muted-foreground">{program.description}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Requisitos:</h4>
                    <ul className="space-y-1 text-sm">
                      {program.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Beneficios:</h4>
                    <ul className="space-y-1 text-sm">
                      {program.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-muted-foreground">{program.investment}</p>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  Aplicar Ahora
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Beneficios para partners */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">¿Por qué ser Partner de PC Ando?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerBenefits.map((benefit, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Casos de éxito */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Casos de Éxito</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">{story.partner}</CardTitle>
                  <Badge variant="outline">{story.category}</Badge>
                </div>
                <p className="text-primary font-semibold">{story.result}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{story.story}</p>
                <div className="space-y-2">
                  {story.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full"></span>
                      <span className="text-sm font-medium">{metric}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Proceso de aplicación */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Proceso de Aplicación</CardTitle>
          <p className="text-center text-muted-foreground">
            Cómo convertirse en partner de PC Ando en 5 simples pasos
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {applicationSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-muted-foreground mb-1">{step.description}</p>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {step.duration}
                  </Badge>
                  {index < applicationSteps.length - 1 && (
                    <div className="mt-4 h-8 w-0.5 bg-border ml-5"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center space-y-4">
            <Button size="lg">
              <Handshake className="w-5 h-5 mr-2" />
              Iniciar Aplicación de Partnership
            </Button>
            <p className="text-sm text-muted-foreground">
              ¿Tienes preguntas? Contacta a nuestro equipo de partnerships: partners@pcando.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
