#!/bin/bash

# Script para deployment a GitHub Pages
echo "🚀 Iniciando deployment a GitHub Pages..."

# Verificar que estamos en la rama main
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: Debes estar en la rama 'main' para hacer el deployment"
    exit 1
fi

# Asegurarse de que no hay cambios sin commit
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ Error: Tienes cambios sin hacer commit. Haz commit primero."
    exit 1
fi

# Instalar dependencias si es necesario
echo "📦 Instalando dependencias..."
npm install

# Build para GitHub Pages
echo "🔨 Creando build para GitHub Pages..."
npm run build:gh-pages

# Deploy usando gh-pages
echo "🚢 Desplegando a GitHub Pages..."
npm run deploy

echo "✅ ¡Deployment completado!"
echo "🌐 Tu sitio estará disponible en: https://ksmol22.github.io/Pcando_Oficial/"
echo "⏳ Puede tomar unos minutos en propagarse..."
