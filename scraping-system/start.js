#!/usr/bin/env node

const ScrapingAPI = require('./api/scraping-api');
const config = require('./config/scraping-config.json');

/**
 * Script principal para iniciar el sistema de scraping
 */
async function startScrapingSystem() {
  console.log('🚀 Iniciando Sistema de Scraping PCando Oficial');
  console.log('================================================');
  
  try {
    // Verificar variables de entorno
    checkEnvironmentVariables();
    
    // Crear instancia de la API
    const api = new ScrapingAPI(config.api.port);
    
    // Iniciar servidor
    await api.start();
    
    // Mostrar información de inicio
    displayStartupInfo();
    
  } catch (error) {
    console.error('❌ Error al iniciar el sistema:', error);
    process.exit(1);
  }
}

/**
 * Verificar variables de entorno necesarias
 */
function checkEnvironmentVariables() {
  const requiredVars = [];
  const optionalVars = [
    'DATABASE_URL',
    'REDIS_URL',
    'PROXY_LIST',
    'CAPTCHA_SOLVER_KEY'
  ];

  // Verificar variables requeridas
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Variable de entorno requerida no encontrada: ${varName}`);
    }
  }

  // Mostrar variables opcionales disponibles
  console.log('📋 Variables de entorno:');
  for (const varName of optionalVars) {
    const status = process.env[varName] ? '✅' : '⚪';
    console.log(`   ${status} ${varName}`);
  }
  console.log('');
}

/**
 * Mostrar información de inicio del sistema
 */
function displayStartupInfo() {
  const port = config.api.port;
  
  console.log('✅ Sistema iniciado correctamente');
  console.log('');
  console.log('📊 Endpoints de la API:');
  console.log(`   http://localhost:${port}/api/health`);
  console.log(`   http://localhost:${port}/api/scraping/search?query=RTX%204070`);
  console.log(`   http://localhost:${port}/api/scraping/compare?productName=RTX%204070`);
  console.log(`   http://localhost:${port}/api/scraping/stats`);
  console.log('');
  
  console.log('🔍 Scrapers habilitados:');
  if (config.scrapers.amazon.enabled) {
    console.log('   ✅ Amazon (con Puppeteer)');
  }
  if (config.scrapers.mercadolibre.enabled) {
    const countries = Object.keys(config.scrapers.mercadolibre.countries);
    console.log(`   ✅ MercadoLibre (${countries.join(', ')})`);
  }
  console.log('');
  
  console.log('📖 Ejemplos de uso:');
  console.log(`   curl "http://localhost:${port}/api/scraping/search?query=Intel%20Core%20i7"`);
  console.log(`   curl "http://localhost:${port}/api/scraping/compare?productName=RTX%204070"`);
  console.log('');
  
  console.log('💡 Para detener el servidor: Ctrl+C');
  console.log('================================================');
}

/**
 * Función para prueba rápida del sistema
 */
async function runQuickTest() {
  console.log('🧪 Ejecutando prueba rápida...');
  
  try {
    // Probar endpoint de salud
    const healthResponse = await fetch(`http://localhost:${config.api.port}/api/health`);
    const healthData = await healthResponse.json();
    
    console.log('✅ Health check:', healthData.status);
    
    // Probar búsqueda simple
    const searchResponse = await fetch(`http://localhost:${config.api.port}/api/scraping/search?query=Intel&maxResults=2`);
    const searchData = await searchResponse.json();
    
    console.log(`✅ Búsqueda de prueba: ${searchData.totalResults || 0} resultados`);
    
  } catch (error) {
    console.log('❌ Error en prueba:', error.message);
  }
}

// Manejo de argumentos de línea de comandos
const command = process.argv[2];

switch (command) {
  case 'test':
    console.log('Ejecutando en modo de prueba...');
    startScrapingSystem().then(() => {
      setTimeout(runQuickTest, 2000);
    });
    break;
    
  case 'config':
    console.log('Configuración actual:');
    console.log(JSON.stringify(config, null, 2));
    break;
    
  case 'help':
    console.log('Sistema de Scraping PCando Oficial');
    console.log('');
    console.log('Uso: node start.js [comando]');
    console.log('');
    console.log('Comandos disponibles:');
    console.log('  (sin comando)  Iniciar el sistema normalmente');
    console.log('  test          Iniciar y ejecutar prueba rápida');
    console.log('  config        Mostrar configuración actual');
    console.log('  help          Mostrar esta ayuda');
    break;
    
  default:
    startScrapingSystem();
    break;
}

// Manejo de señales del sistema
process.on('SIGTERM', () => {
  console.log('\\n📴 Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\\n📴 Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('💥 Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promise rechazada no manejada:', reason);
  process.exit(1);
});
