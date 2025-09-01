import React from 'react';
import { Shield, Clock, FileText, CheckCircle, AlertCircle, Wrench, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Warranties() {
  const warrantyTypes = [
    {
      name: "Garantía Estándar",
      duration: "1 año",
      coverage: "Defectos de fabricación",
      color: "blue",
      features: [
        "Reemplazo gratuito por defectos",
        "Soporte técnico incluido",
        "Proceso simplificado de RMA"
      ]
    },
    {
      name: "Garantía Extendida",
      duration: "2-3 años",
      coverage: "Cobertura ampliada",
      color: "green",
      features: [
        "Todo lo de garantía estándar",
        "Protección contra daños accidentales",
        "Reemplazo express 48hrs",
        "Soporte prioritario 24/7"
      ]
    },
    {
      name: "Garantía Premium",
      duration: "3-5 años",
      coverage: "Cobertura total",
      color: "purple",
      features: [
        "Todo lo de garantía extendida",
        "Cobertura internacional",
        "Reemplazo inmediato",
        "Técnico especializado asignado",
        "Actualizaciones de hardware gratuitas"
      ]
    }
  ];

  const warrantyProcess = [
    {
      step: 1,
      title: "Reportar Problema",
      description: "Contacta a soporte técnico o crea un ticket online",
      icon: AlertCircle
    },
    {
      step: 2,
      title: "Diagnóstico",
      description: "Nuestros técnicos evalúan el problema",
      icon: Wrench
    },
    {
      step: 3,
      title: "Autorización RMA",
      description: "Se aprueba el reemplazo o reparación",
      icon: CheckCircle
    },
    {
      step: 4,
      title: "Envío/Recepción",
      description: "Enviamos el producto nuevo o reparado",
      icon: ArrowRight
    }
  ];

  const coverageDetails = {
    covered: [
      "Defectos de fabricación",
      "Fallas de componentes internos",
      "Problemas de rendimiento bajo especificaciones",
      "Incompatibilidades de hardware verificadas",
      "Daños durante el transporte (primeros 15 días)",
      "Sobrecalentamiento por defectos de diseño"
    ],
    notCovered: [
      "Daños por mal uso o negligencia",
      "Daños por líquidos derramados",
      "Modificaciones no autorizadas",
      "Daños por sobrevoltaje o picos eléctricos",
      "Desgaste normal por uso",
      "Software instalado por el usuario"
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Garantías y Protección</h1>
        <p className="text-muted-foreground text-lg">
          Protege tu inversión con nuestros planes de garantía completos
        </p>
      </div>

      <Tabs defaultValue="types" className="space-y-8">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="types">Tipos de Garantía</TabsTrigger>
          <TabsTrigger value="process">Proceso RMA</TabsTrigger>
          <TabsTrigger value="coverage">Cobertura</TabsTrigger>
          <TabsTrigger value="contact">Contacto</TabsTrigger>
        </TabsList>

        <TabsContent value="types">
          <div className="grid md:grid-cols-3 gap-6">
            {warrantyTypes.map((warranty, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{warranty.name}</CardTitle>
                    <Badge variant={warranty.color === 'blue' ? 'default' : warranty.color === 'green' ? 'secondary' : 'outline'}>
                      {warranty.duration}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{warranty.coverage}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {warranty.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant={index === 1 ? 'default' : 'outline'}>
                    {index === 1 ? 'Más Popular' : 'Seleccionar Plan'}
                  </Button>
                </CardContent>
                {index === 1 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500">Más Popular</Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="process">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Proceso de Garantía (RMA)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {warrantyProcess.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        Paso {step.step}: {step.title}
                      </h3>
                      <p className="text-muted-foreground">{step.description}</p>
                      {index < warrantyProcess.length - 1 && (
                        <div className="mt-4 h-8 w-0.5 bg-border ml-6"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Tiempos de Procesamiento
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Garantía Estándar:</span>
                    <p>5-7 días hábiles</p>
                  </div>
                  <div>
                    <span className="font-medium">Garantía Extendida:</span>
                    <p>2-3 días hábiles</p>
                  </div>
                  <div>
                    <span className="font-medium">Garantía Premium:</span>
                    <p>24-48 horas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  ¿Qué está Cubierto?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coverageDetails.covered.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  ¿Qué NO está Cubierto?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coverageDetails.notCovered.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Términos y Condiciones Importantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• La garantía inicia desde la fecha de compra registrada en nuestro sistema</li>
                  <li>• Se requiere comprobante de compra para cualquier reclamo de garantía</li>
                  <li>• Los productos deben ser devueltos en su empaque original cuando sea posible</li>
                  <li>• La garantía es válida únicamente para el comprador original</li>
                  <li>• No transferible a terceros sin autorización escrita</li>
                  <li>• La garantía puede ser voided por modificaciones no autorizadas</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reportar Problema de Garantía</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Antes de contactar, ten a mano:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Número de orden o factura</li>
                    <li>• Número de serie del producto</li>
                    <li>• Descripción detallada del problema</li>
                    <li>• Fotos/videos del problema (si aplica)</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Crear Ticket de Garantía
                  </Button>
                  <Button variant="outline" className="w-full">
                    Chat en Vivo con Soporte
                  </Button>
                  <Button variant="outline" className="w-full">
                    Llamar: +1 (555) 123-4567
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Centro de Garantías</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Dirección Física</h4>
                  <p className="text-sm text-muted-foreground">
                    PC Ando Tech Center<br />
                    Av. Tecnológica 123, Piso 5<br />
                    Ciudad de México, CDMX 01234<br />
                    México
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Horarios de Atención</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>Lunes - Viernes: 8:00 AM - 8:00 PM</p>
                    <p>Sábados: 9:00 AM - 6:00 PM</p>
                    <p>Domingos: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Contacto Directo</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>Email: garantias@pcando.com</p>
                    <p>Tel: +1 (555) 123-4567 ext. 2</p>
                    <p>WhatsApp: +1 (555) 123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
