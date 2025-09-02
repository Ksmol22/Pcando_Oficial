#!/bin/bash

echo "🚀 Iniciando deployment a GitHub Pages..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

echo "📝 Agregando archivos al repositorio..."
git add .

echo "💾 Haciendo commit..."
git commit -m "Update GitHub Pages configuration and fix deployment issues

- Add temporary landing page with instructions
- Update GitHub Actions workflow for better deployment
- Fix builds.tsx compilation errors
- Configure proper GitHub Pages setup
- Ready for GitHub Pages activation"

echo "📤 Subiendo cambios a GitHub..."
git push origin main

echo "✅ Cambios enviados exitosamente!"
echo ""
echo "🔧 Próximos pasos:"
echo "1. Ve a tu repositorio: https://github.com/Ksmol22/Pcando_Oficial"
echo "2. Ve a Settings → Pages"
echo "3. En 'Source' selecciona 'GitHub Actions'"
echo "4. Guarda los cambios"
echo "5. Espera a que se ejecute el workflow (2-5 minutos)"
echo "6. Tu app estará disponible en: https://ksmol22.github.io/Pcando_Oficial/"
