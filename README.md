# PCando Oficial 🖥️

Una aplicación web moderna para configurar y armar computadoras, con un sistema completo de compatibilidad y estimación de rendimiento.

[![Deploy to GitHub Pages](https://github.com/Ksmol22/Pcando_Oficial/actions/workflows/deploy.yml/badge.svg)](https://github.com/Ksmol22/Pcando_Oficial/actions/workflows/deploy.yml)

## 🌐 Demo en Vivo

**🚀 [Ver Demo en GitHub Pages](https://ksmol22.github.io/Pcando_Oficial/)**

## ✨ Características Principales

### 🔧 Configurador de PC
- **Selección de Componentes**: CPU, GPU, RAM, Motherboard, Storage, PSU, Case, Cooler
- **Sistema de Compatibilidad Avanzado**: Validación automática de compatibilidad entre componentes
- **Estimación de Rendimiento**: Cálculos de performance para Gaming, Workstation y Streaming
- **Comparación de Precios**: Múltiples tiendas y proveedores

### 🎨 Interfaz de Usuario
- **Diseño Responsive**: Funciona perfectamente en desktop y mobile
- **Tema Oscuro/Claro**: Interfaz moderna con soporte para temas
- **Componentes Interactivos**: Cards de productos, filtros, búsqueda en tiempo real
- **Feedback Visual**: Indicadores de compatibilidad y progress bars

### 🧠 Sistema Inteligente
- **Algoritmo de Compatibilidad**: Verifica sockets, tipos de RAM, consumo energético
- **Base de Datos Completa**: Más de 20 componentes reales con especificaciones detalladas
- **Cálculos de Performance**: Basado en benchmarks reales de hardware

### 🔐 Sistema de Roles
- **Cliente**: Acceso completo al configurador
- **Soporte**: Herramientas adicionales de asistencia
- **Admin**: Gestión completa del sistema

## 🚀 Deployment a GitHub Pages

### Deployment Automático
El proyecto se deploya automáticamente a GitHub Pages cuando se hace push a la rama `main`.

### Deployment Manual

1. **Clonar el repositorio**:
```bash
git clone https://github.com/Ksmol22/Pcando_Oficial.git
cd Pcando_Oficial
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Ejecutar script de deployment**:
```bash
./deploy.sh
```

O manualmente:
```bash
npm run build:gh-pages
npm run deploy
```
./setup.sh
```

### 3. Configuración manual

Si prefieres configurar manualmente:

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tu configuración de base de datos
```

### 4. Configurar la base de datos

#### Opción A: Usar Neon Database (Recomendado)

1. Ve a [Neon Database](https://neon.tech)
2. Crea una cuenta y un nuevo proyecto
3. Copia la URL de conexión a tu archivo `.env`:

```env
DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require
```

#### Opción B: PostgreSQL Local

```bash
# macOS con Homebrew
brew install postgresql
brew services start postgresql

# Crear base de datos
createdb pcando_db

# Configurar .env
DATABASE_URL=postgresql://localhost:5432/pcando_db
```

### 5. Inicializar la base de datos

```bash
# Generar migraciones
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# (Opcional) Cargar datos de ejemplo
npm run db:seed
```

### 6. Ejecutar la aplicación

#### Modo Desarrollo (Recomendado para empezar)

```bash
# Versión minimal - sin dependencias de base de datos
npm run dev:minimal
```

La aplicación estará disponible en [http://localhost:5000](http://localhost:5000)

#### Otras opciones de desarrollo

```bash
# Con API mock estructurada
npm run dev:simple

# Con base de datos real (requiere configuración completa)
npm run dev
```

### 🔧 Resolución de problemas

#### Error: "Node.js no encontrado"
```bash
# macOS con Homebrew
brew install node

# Verificar instalación
node --version
npm --version
```

#### Error: "DATABASE_URL no configurado"
- Asegúrate de haber copiado `.env.example` a `.env`
- Configura una URL de base de datos válida en `.env`

#### Error de conexión a la base de datos
- Verifica que tu base de datos esté ejecutándose
- Confirma que las credenciales en `.env` sean correctas
- Para Neon Database, asegúrate de incluir `?sslmode=require`

## 📁 Estructura del Proyecto

```
├── client/                 # Frontend React
│   └── src/
│       ├── components/     # Componentes React
│       ├── pages/         # Páginas de la aplicación
│       ├── hooks/         # Custom hooks
│       └── lib/           # Utilidades y configuraciones
├── server/                # Backend Express
│   ├── index.ts          # Punto de entrada del servidor
│   ├── routes.ts         # Definición de rutas API
│   ├── db.ts            # Configuración de base de datos
│   └── storage.ts       # Capa de acceso a datos
├── shared/               # Código compartido
│   └── schema.ts        # Esquemas de base de datos y validación
└── migrations/          # Migraciones de base de datos (auto-generado)
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia el servidor de desarrollo

# Producción  
npm run build           # Construye la aplicación para producción
npm start              # Ejecuta la aplicación en modo producción

# Base de datos
npm run db:generate    # Genera archivos de migración
npm run db:migrate     # Aplica migraciones
npm run db:studio      # Abre Drizzle Studio (GUI para la DB)
```

## 🔧 Desarrollo

### Agregar Nuevos Componentes

1. **Componentes de PC**: Modifica `shared/schema.ts` para agregar nuevos tipos
2. **Componentes UI**: Los componentes están en `client/src/components/`
3. **API Endpoints**: Agrega nuevas rutas en `server/routes.ts`

### Estructura de la Base de Datos

El proyecto utiliza las siguientes tablas principales:

- `users` - Información de usuarios
- `components` - Catálogo de componentes de PC
- `builds` - Configuraciones de PC guardadas
- `build_components` - Relación muchos-a-muchos entre builds y componentes
- `cart_items` - Carrito de compras

## ⚡ Guía de Inicio Rápido

Para ejecutar el proyecto inmediatamente después de la clonación:

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar base de datos
npm run db:migrate
npm run db:seed

# 3. Ejecutar en desarrollo
npm run dev:db
```

Luego visita **http://localhost:5000** para ver tu aplicación funcionando.

## 🗃️ Comandos Disponibles

### Desarrollo
- `npm run dev:db` - Desarrollo con PostgreSQL (Recomendado)
- `npm run dev:simple` - Desarrollo con datos mock
- `npm run dev:minimal` - Desarrollo básico

### Producción
- `npm run build` - Compilar para producción
- `npm run start` - Ejecutar servidor de producción

### Base de Datos
- `npm run db:generate` - Generar migraciones
- `npm run db:migrate` - Ejecutar migraciones
- `npm run db:seed` - Llenar base de datos con datos de ejemplo
- `npm run db:studio` - Abrir Drizzle Studio (GUI de base de datos)

## 🔧 Solución de Problemas

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté ejecutándose
brew services list | grep postgresql

# Reiniciar PostgreSQL si es necesario
brew services restart postgresql
```

### Error de migraciones
```bash
# Limpiar y volver a ejecutar migraciones
dropdb pcando_db
createdb pcando_db
npm run db:migrate
npm run db:seed
```

### Puerto ocupado
Si el puerto 5000 está ocupado, puedes cambiar el puerto en tu archivo `.env`:
```env
PORT=3001
```

### Problemas con dependencias
```bash
# Limpiar caché e instalar dependencias nuevamente
rm -rf node_modules package-lock.json
npm install
```

## 🌐 Despliegue

### Replit

Este proyecto está optimizado para Replit:

1. Importa el repositorio en Replit
2. Configura las variables de entorno en el panel de Secrets
3. El proyecto se ejecutará automáticamente

### Otros Servicios

Para desplegar en otros servicios (Vercel, Railway, etc.):

1. Asegúrate de configurar todas las variables de entorno
2. Ejecuta `npm run build` para construir la aplicación
3. Ejecuta `npm start` para iniciar el servidor de producción

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🐛 Reporte de Problemas

Si encuentras algún problema o tienes sugerencias, por favor abre un issue en el repositorio de GitHub.

## 📧 Contacto

- GitHub: [@Ksmol22](https://github.com/Ksmol22)
- Proyecto: [Pcando Oficial](https://github.com/Ksmol22/Pcando_Oficial)

---

**Estado del Proyecto**: ✅ **FUNCIONAL Y LISTO PARA USAR**

- ✅ Dependencias resueltas
- ✅ PostgreSQL configurado
- ✅ Migraciones aplicadas
- ✅ Datos de semilla cargados
- ✅ Servidor funcionando correctamente
- ✅ APIs disponibles y operativas

🎮 **¡Tu plataforma PCando Oficial está lista para configurar PCs gaming!** 🎮
