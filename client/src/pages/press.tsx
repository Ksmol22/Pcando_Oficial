import React from 'react';
import { Newspaper, Calendar, Users, ExternalLink, Tag, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Press() {
  const pressReleases = [
    {
      date: "2024-01-15",
      title: "PC Ando cierra 2023 con crecimiento del 150% en ventas gaming",
      excerpt: "La empresa mexicana líder en componentes gaming reporta un año récord impulsado por el boom del gaming en América Latina.",
      category: "Resultados Financieros",
      views: "2.3K",
      featured: true
    },
    {
      date: "2023-12-08",
      title: "Alianza estratégica con NVIDIA para RTX 40 Series en México",
      excerpt: "PC Ando se convierte en distribuidor premium de las nuevas tarjetas gráficas RTX 40 Series para el mercado mexicano.",
      category: "Partnerships",
      views: "1.8K"
    },
    {
      date: "2023-11-22",
      title: "Expansión a Colombia: PC Ando llega al mercado sudamericano",
      excerpt: "La compañía inaugura operaciones en Bogotá como parte de su plan de expansión internacional.",
      category: "Expansión",
      views: "1.5K"
    },
    {
      date: "2023-10-30",
      title: "PC Ando lanza configurador automático de PCs con IA",
      excerpt: "Nueva herramienta permite crear builds optimizadas usando inteligencia artificial y machine learning.",
      category: "Innovación",
      views: "3.1K",
      featured: true
    },
    {
      date: "2023-09-15",
      title: "Certificación ISO 9001 refuerza compromiso con la calidad",
      excerpt: "PC Ando obtiene certificación internacional que respalda sus procesos de calidad y atención al cliente.",
      category: "Certificaciones",
      views: "890"
    }
  ];

  const mediaKit = [
    {
      type: "Logos Corporativos",
      description: "Logos en alta resolución en diferentes formatos",
      files: ["Logo PNG (Transparente)", "Logo JPG", "Logo SVG (Vectorial)", "Variaciones monocromáticas"],
      size: "12 MB"
    },
    {
      type: "Fotos Corporativas",
      description: "Imágenes oficiales de la empresa y productos",
      files: ["Fotos de oficinas", "Team photos", "Productos destacados", "Eventos corporativos"],
      size: "45 MB"
    },
    {
      type: "Información Corporativa",
      description: "Datos oficiales y información de contexto",
      files: ["Fact sheet", "Biografías ejecutivos", "Historia de la empresa", "Datos de contacto"],
      size: "2 MB"
    }
  ];

  const upcomingEvents = [
    {
      date: "2024-03-15",
      event: "Tech Summit México 2024",
      location: "Centro Citibanamex, CDMX",
      type: "Conferencia",
      description: "PC Ando presentará las tendencias gaming para 2024"
    },
    {
      date: "2024-04-20",
      event: "GameWeek Colombia",
      location: "Corferias, Bogotá",
      type: "Feria",
      description: "Debut oficial en el mercado colombiano"
    },
    {
      date: "2024-05-10",
      event: "Investor Day Q1 2024",
      location: "Virtual Event",
      type: "Presentación",
      description: "Resultados financieros del primer trimestre"
    }
  ];

  const mediaContacts = [
    {
      name: "María González",
      position: "Directora de Comunicaciones",
      email: "maria.gonzalez@pcando.com",
      phone: "+52 (55) 1234-5678 ext. 201",
      specialties: ["Estrategia corporativa", "Partnerships", "Expansión internacional"]
    },
    {
      name: "Carlos Mendoza",
      position: "CEO & Spokesperson",
      email: "carlos.mendoza@pcando.com",
      phone: "+52 (55) 1234-5678 ext. 100",
      specialties: ["Visión estratégica", "Industria gaming", "Innovación tecnológica"]
    },
    {
      name: "Ana Rodríguez",
      position: "CTO - Vocera Técnica",
      email: "ana.rodriguez@pcando.com",
      phone: "+52 (55) 1234-5678 ext. 102",
      specialties: ["Desarrollo tecnológico", "Inteligencia artificial", "Productos"]
    }
  ];

  const awards = [
    {
      year: "2023",
      award: "Mejor E-commerce Gaming México",
      organization: "Digital Commerce Awards",
      description: "Reconocimiento por excelencia en experiencia de usuario"
    },
    {
      year: "2023",
      award: "Startup del Año - Tecnología",
      organization: "Premio Emprendedor Mexicano",
      description: "Por innovación y crecimiento sostenido"
    },
    {
      year: "2022",
      award: "Partner del Año NVIDIA",
      organization: "NVIDIA Partner Awards",
      description: "Mejor distribuidor de GPUs gaming en México"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Sala de Prensa</h1>
        <p className="text-muted-foreground text-lg">
          Noticias, recursos y contactos para medios de comunicación
        </p>
      </div>

      {/* Comunicados destacados */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Comunicados de Prensa</h2>
        <div className="space-y-6">
          {pressReleases.map((release, index) => (
            <Card key={index} className={`${release.featured ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={release.featured ? "default" : "secondary"}>
                        {release.category}
                      </Badge>
                      {release.featured && <Badge variant="outline">Destacado</Badge>}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        {release.views}
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                    <p className="text-muted-foreground">{release.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(release.date).toLocaleDateString('es-MX')}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Leer Más
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Media Kit */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Media Kit</h2>
          <div className="space-y-4">
            {mediaKit.map((kit, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{kit.type}</CardTitle>
                  <p className="text-sm text-muted-foreground">{kit.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {kit.files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="w-1 h-1 bg-primary rounded-full"></span>
                        {file}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{kit.size}</Badge>
                    <Button size="sm">
                      Descargar
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Próximos eventos */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Próximos Eventos</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.event}</CardTitle>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(event.date).toLocaleDateString('es-MX')}
                        </div>
                        <div>{event.location}</div>
                      </div>
                    </div>
                    <Badge variant="secondary">{event.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contactos de prensa */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Contactos para Medios</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {mediaContacts.map((contact, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{contact.name}</CardTitle>
                <p className="text-sm text-primary font-medium">{contact.position}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm mb-4">
                  <p><strong>Email:</strong> {contact.email}</p>
                  <p><strong>Tel:</strong> {contact.phone}</p>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">Especialidades:</p>
                  <div className="flex flex-wrap gap-1">
                    {contact.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Premios y reconocimientos */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Premios y Reconocimientos</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {awards.map((award, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🏆</span>
                </div>
                <CardTitle className="text-lg">{award.award}</CardTitle>
                <p className="text-sm text-muted-foreground">{award.organization}</p>
                <Badge variant="secondary">{award.year}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{award.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5" />
            Información para Periodistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Solicitud de Entrevistas</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Para solicitar entrevistas con nuestros ejecutivos, favor de contactar 
                con 48 horas de anticipación a través de nuestros canales oficiales.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Email: prensa@pcando.com</li>
                <li>• Tel: +52 (55) 1234-5678 ext. 200</li>
                <li>• WhatsApp: +52 (55) 1234-5678</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Horarios de Atención</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Lunes - Viernes: 9:00 AM - 6:00 PM (GMT-6)</p>
                <p>Sábados: 10:00 AM - 2:00 PM (GMT-6)</p>
                <p>Emergencias: 24/7 vía WhatsApp</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Idiomas Disponibles</h4>
                <div className="flex gap-2">
                  <Badge variant="outline">Español</Badge>
                  <Badge variant="outline">English</Badge>
                  <Badge variant="outline">Português</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
