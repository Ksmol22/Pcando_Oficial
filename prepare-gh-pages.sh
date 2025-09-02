#!/bin/bash

echo "🧹 Limpiando archivos obsoletos para GitHub Pages..."

# Eliminar archivos obsoletos de la raíz que pueden interferir
if [ -f "index.html" ]; then
    echo "❌ Eliminando index.html obsoleto de la raíz"
    rm index.html
fi

if [ -f "CNAME" ] && [ ! -s "CNAME" ]; then
    echo "❌ Eliminando CNAME vacío"
    rm CNAME
fi

# Limpiar dist anterior
if [ -d "dist" ]; then
    echo "🗑️ Limpiando directorio dist anterior"
    rm -rf dist
fi

echo "✅ Limpieza completada"
echo "🏗️ Ejecutando build para GitHub Pages..."

# Build para GitHub Pages
export GITHUB_PAGES=true
npm run build:gh-pages

if [ -d "dist" ]; then
    echo "✅ Build completado exitosamente"
    echo "📁 Contenido de dist:"
    ls -la dist/
else
    echo "❌ Error en el build"
    exit 1
fi

echo "🚀 Listo para deploy a GitHub Pages"
