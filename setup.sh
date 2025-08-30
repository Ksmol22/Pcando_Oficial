#!/bin/bash

# PCando Oficial - Script de configuración automática

echo "🚀 Configurando PCando Oficial..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado."
    echo "📋 Por favor, instala Node.js siguiendo las instrucciones en SETUP.md"
    echo "🔗 https://nodejs.org"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo "✅ npm encontrado: $(npm --version)"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "⚙️  Creando archivo de configuración .env..."
    cp .env.example .env
    echo "📝 Por favor, edita el archivo .env con tus configuraciones de base de datos"
else
    echo "✅ Archivo .env ya existe"
fi

# Verificar si DATABASE_URL está configurado
if ! grep -q "DATABASE_URL=postgresql://" .env; then
    echo "⚠️  IMPORTANTE: Configura tu DATABASE_URL en el archivo .env"
    echo "📋 Ejemplo para Neon Database:"
    echo "   DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require"
    echo ""
    echo "📋 Ejemplo para PostgreSQL local:"
    echo "   DATABASE_URL=postgresql://localhost:5432/pcando_db"
fi

echo ""
echo "🎉 Configuración inicial completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura tu base de datos en el archivo .env"
echo "2. Ejecuta: npm run db:generate"
echo "3. Ejecuta: npm run db:migrate" 
echo "4. (Opcional) Ejecuta: npm run db:seed"
echo "5. Ejecuta: npm run dev"
echo ""
echo "🌐 La aplicación estará disponible en http://localhost:5000"
echo ""
echo "📚 Para más información detallada, consulta:"
echo "   - README.md (instrucciones completas)"
echo "   - SETUP.md (guía de configuración de entorno)"
