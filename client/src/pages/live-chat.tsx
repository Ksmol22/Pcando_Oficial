import React from 'react';
import { MessageCircle, Users, PhoneCall, Clock, Star, Globe, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function LiveChat() {
  const agents = [
    {
      name: "Carlos Rodríguez",
      specialty: "Hardware Especialista",
      status: "online",
      rating: 4.9,
      languages: ["Español", "English"]
    },
    {
      name: "Ana Martínez",
      specialty: "Configuración de PCs",
      status: "online",
      rating: 4.8,
      languages: ["Español", "English"]
    },
    {
      name: "Luis García",
      specialty: "Soporte Técnico",
      status: "busy",
      rating: 4.7,
      languages: ["Español"]
    }
  ];

  const commonQuestions = [
    "¿Cuál es la mejor GPU para gaming?",
    "¿Cómo sé si mi fuente es suficiente?",
    "¿Qué motherboard necesito para mi CPU?",
    "¿Cuánta RAM necesito para gaming?",
    "¿Refrigeración líquida o por aire?"
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Chat en Vivo</h1>
        <p className="text-muted-foreground text-lg">
          Conecta instantáneamente con nuestros expertos en hardware
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Panel principal de chat */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Iniciar Conversación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 space-y-4">
                <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">¡Hola! 👋</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Estamos aquí para ayudarte con cualquier duda sobre componentes, 
                  compatibilidad o configuración de PC.
                </p>
                
                <div className="space-y-2 pt-4">
                  <Button size="lg" className="w-full max-w-sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Iniciar Chat Ahora
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Tiempo estimado de respuesta: &lt; 30 segundos
                  </p>
                </div>
              </div>

              {/* Preguntas comunes */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-3">Preguntas frecuentes:</h4>
                <div className="space-y-2">
                  {commonQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 text-sm bg-muted hover:bg-accent rounded-lg transition-colors flex items-center justify-between group"
                    >
                      <span>{question}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar con agentes */}
        <div className="space-y-6">
          {/* Estado del servicio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Estado del Servicio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Agentes disponibles</span>
                  <Badge variant="secondary">3 online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tiempo promedio</span>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    25s
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Satisfacción</span>
                  <Badge variant="default">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    4.8/5
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agentes disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Agentes Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map((agent, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          agent.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{agent.name}</h4>
                        <p className="text-xs text-muted-foreground">{agent.specialty}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{agent.rating}</span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {agent.languages.map((lang, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                              <Globe className="w-2 h-2 mr-1" />
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Otros canales */}
          <Card>
            <CardHeader>
              <CardTitle>Otros Canales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <PhoneCall className="w-4 h-4 mr-2" />
                Llamar: +1 (555) 123-4567
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp: +1 (555) 123-4567
              </Button>
              <div className="text-xs text-muted-foreground text-center pt-2">
                Horarios: Lun-Dom 8:00-22:00
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
