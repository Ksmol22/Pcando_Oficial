import React from 'react';
import { HelpCircle, MessageCircle, BookOpen, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HelpCenter() {
  const helpTopics = [
    {
      title: 'Configuración de PC',
      description: 'Guías paso a paso para armar tu computadora',
      icon: '🔧',
      articles: [
        'Cómo elegir una motherboard compatible',
        'Instalación de CPU y RAM',
        'Conectar cables de alimentación',
        'Primera configuración de BIOS'
      ]
    },
    {
      title: 'Compatibilidad de Componentes',
      description: 'Verifica que tus componentes sean compatibles',
      icon: '✅',
      articles: [
        'Compatibilidad de sockets de CPU',
        'Verificar capacidad de fuente de poder',
        'Tamaños de gabinete y placas madre',
        'Compatibilidad de memoria RAM'
      ]
    },
    {
      title: 'Solución de Problemas',
      description: 'Resuelve los problemas más comunes',
      icon: '🛠️',
      articles: [
        'PC no enciende - Diagnóstico',
        'Problemas de temperatura alta',
        'Errores de memoria RAM',
        'GPU no detectada'
      ]
    },
    {
      title: 'Garantías y Devoluciones',
      description: 'Todo sobre políticas de garantía',
      icon: '📋',
      articles: [
        'Política de garantía de componentes',
        'Proceso de RMA (devolución)',
        'Garantía extendida disponible',
        'Exclusiones de garantía'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Centro de Ayuda</h1>
        <p className="text-muted-foreground text-lg">
          Todo lo que necesitas saber para armar tu PC perfecta
        </p>
      </div>

      {/* Accesos rápidos */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Chat en Vivo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Habla directamente con nuestros expertos
            </p>
            <Button>Iniciar Chat</Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Phone className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Soporte Telefónico</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Llámanos: +1 (555) 123-4567
            </p>
            <Badge variant="secondary">
              <Clock className="w-3 h-3 mr-1" />
              Lun-Vie 9:00-18:00
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Mail className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-sm text-muted-foreground mb-4">
              ayuda@pcando.com
            </p>
            <Badge variant="secondary">Respuesta en 24h</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Temas de ayuda */}
      <div className="grid md:grid-cols-2 gap-8">
        {helpTopics.map((topic, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">{topic.icon}</span>
                <div>
                  <h3 className="text-xl">{topic.title}</h3>
                  <p className="text-sm text-muted-foreground font-normal">
                    {topic.description}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topic.articles.map((article, idx) => (
                  <div
                    key={idx}
                    className="p-2 hover:bg-accent rounded cursor-pointer flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{article}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Ver Todos los Artículos
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Popular */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Preguntas Frecuentes</h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            {
              q: "¿Cuánto tiempo tarda mi pedido en llegar?",
              a: "Los envíos estándar tardan 3-5 días hábiles. Express 1-2 días."
            },
            {
              q: "¿Puedo cambiar los componentes de un build pre-armado?",
              a: "Sí, todos nuestros builds son personalizables según tus necesidades."
            },
            {
              q: "¿Ofrecen servicio de armado e instalación?",
              a: "Sí, por $99 incluimos armado, instalación de Windows y pruebas."
            },
            {
              q: "¿Qué pasa si un componente llega defectuoso?",
              a: "Manejamos el proceso de garantía directamente con el fabricante."
            }
          ].map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
