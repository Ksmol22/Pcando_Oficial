import React from 'react';
import { MessageCircle, X, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface LiveChatProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  userId?: string;
  userRole?: string;
}

export default function LiveChat({ 
  isMinimized, 
  onMinimize, 
  onMaximize, 
  onClose, 
  userId, 
  userRole 
}: LiveChatProps) {
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onMaximize}
          className="rounded-full w-12 h-12 shadow-lg"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Chat en vivo</CardTitle>
          <div className="flex space-x-1">
            <Button onClick={onMinimize} variant="ghost" size="icon" className="h-6 w-6">
              <Minus className="h-4 w-4" />
            </Button>
            <Button onClick={onClose} variant="ghost" size="icon" className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-64 bg-muted rounded-lg p-3 mb-3 overflow-y-auto">
            <div className="text-sm text-muted-foreground text-center">
              ¡Hola! ¿En qué podemos ayudarte hoy?
            </div>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button size="sm">
              Enviar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
