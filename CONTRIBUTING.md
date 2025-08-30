# Guía de Contribución - PCando Oficial

¡Gracias por tu interés en contribuir a PCando Oficial! Esta guía te ayudará a comenzar.

## 🚀 Primeros Pasos

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub, luego clona tu fork
git clone https://github.com/tu-usuario/Pcando_Oficial.git
cd Pcando_Oficial

# Agrega el repositorio original como upstream
git remote add upstream https://github.com/Ksmol22/Pcando_Oficial.git
```

### 2. Configuración del Entorno

```bash
# Ejecutar script de configuración
./setup.sh

# O configurar manualmente
npm install
cp .env.example .env
# Editar .env con tu configuración de base de datos
```

### 3. Configurar Base de Datos de Desarrollo

```bash
npm run db:generate
npm run db:migrate
npm run db:seed  # Datos de ejemplo
```

## 🌿 Flujo de Desarrollo

### 1. Crear una Rama

```bash
# Actualizar main
git checkout main
git pull upstream main

# Crear nueva rama para tu feature/fix
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

### 2. Hacer Cambios

- Sigue las convenciones de código existentes
- Escribe mensajes de commit claros y descriptivos
- Actualiza la documentación si es necesario

### 3. Probar Cambios

```bash
# Ejecutar en modo desarrollo
npm run dev

# Verificar que todo funciona correctamente
```

### 4. Commit y Push

```bash
git add .
git commit -m "feat: agregar nueva funcionalidad X"
git push origin feature/nueva-funcionalidad
```

### 5. Crear Pull Request

1. Ve a GitHub y crea un Pull Request
2. Describe claramente los cambios realizados
3. Menciona cualquier issue relacionado
4. Espera la revisión y feedback

## 📝 Convenciones

### Mensajes de Commit

Usamos el formato [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan lógica)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**
```bash
git commit -m "feat(components): agregar filtro por marca"
git commit -m "fix(auth): corregir validación de usuario"
git commit -m "docs: actualizar README con nuevas instrucciones"
```

### Estructura de Código

#### Frontend (React)
```typescript
// Usar hooks y componentes funcionales
import { useState, useEffect } from 'react';
import type { Component } from '@shared/schema';

export function ComponentCard({ component }: { component: Component }) {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="component-card">
      {/* JSX content */}
    </div>
  );
}
```

#### Backend (Express/Drizzle)
```typescript
// Usar tipos explícitos y validación
import { z } from 'zod';
import { insertComponentSchema } from '@shared/schema';

app.post('/api/components', async (req, res) => {
  try {
    const validData = insertComponentSchema.parse(req.body);
    const component = await storage.createComponent(validData);
    res.status(201).json(component);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
});
```

### Estilos CSS

- Usar Tailwind CSS classes
- Seguir el sistema de diseño existente
- Mantener consistencia visual

```tsx
// ✅ Bueno
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Click me
</button>

// ❌ Evitar CSS inline
<button style={{ backgroundColor: 'blue', color: 'white' }}>
  Click me
</button>
```

## 🏗️ Arquitectura del Proyecto

### Frontend
- **React 18** con hooks funcionales
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Tanstack Query** para estado del servidor
- **Wouter** para routing

### Backend
- **Express.js** como servidor HTTP
- **Drizzle ORM** para base de datos
- **PostgreSQL** como base de datos
- **Zod** para validación de schemas

### Estructura de Directorios
```
├── client/src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas principales
│   ├── hooks/         # Custom hooks
│   └── lib/           # Utilidades
├── server/
│   ├── index.ts       # Punto de entrada
│   ├── routes.ts      # Rutas API
│   ├── storage.ts     # Acceso a datos
│   └── auth.ts        # Autenticación
└── shared/
    └── schema.ts      # Esquemas compartidos
```

## 🎯 Áreas de Contribución

### 🌟 Funcionalidades Principales
- Configurador de PC con validación de compatibilidad
- Sistema de comparación de precios
- Calculadora de rendimiento
- Sistema de reviews y ratings

### 🐛 Bugs Conocidos
- Ver la sección [Issues](https://github.com/Ksmol22/Pcando_Oficial/issues)

### 📚 Documentación
- Mejorar documentación de API
- Agregar más ejemplos
- Traducir documentación

### 🎨 UI/UX
- Mejorar responsive design
- Optimizar performance
- Agregar animaciones

## 🔍 Testing

Por implementar:
```bash
# Tests unitarios (por agregar)
npm run test

# Tests e2e (por agregar)
npm run test:e2e
```

## 📋 Checklist para PR

- [ ] El código sigue las convenciones establecidas
- [ ] Los cambios han sido probados localmente
- [ ] Se ha actualizado la documentación si es necesario
- [ ] Los commits siguen el formato conventional
- [ ] No hay errores de TypeScript
- [ ] La funcionalidad es compatible con el diseño existente

## ❓ Preguntas y Ayuda

Si tienes preguntas o necesitas ayuda:

1. **Issues**: Revisa los [issues existentes](https://github.com/Ksmol22/Pcando_Oficial/issues)
2. **Discusiones**: Usa las [GitHub Discussions](https://github.com/Ksmol22/Pcando_Oficial/discussions)
3. **Email**: Contacta al mantenedor

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia del proyecto (MIT).

---

¡Gracias por contribuir a PCando Oficial! 🎉
