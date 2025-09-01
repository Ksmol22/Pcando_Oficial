#!/usr/bin/env node

/**
 * Script de verificación pre-inicio
 * Verifica que todos los servicios estén configurados correctamente
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🔍 Verificando configuración del sistema...\n');

const checks = [
  {
    name: 'Archivos de configuración',
    check: () => {
      const files = [
        'package.json',
        'client/src/hooks/useAuth.ts',
        'server/index-db.ts',
        'scraping-system/package.json',
        'scraping-system/start.js',
        'scraping-system/.env'
      ];
      
      const missing = files.filter(file => !fs.existsSync(file));
      
      if (missing.length > 0) {
        throw new Error(`Archivos faltantes: ${missing.join(', ')}`);
      }
      
      return '✅ Todos los archivos necesarios existen';
    }
  },
  {
    name: 'Dependencias de scraping',
    check: () => {
      const packagePath = 'scraping-system/package.json';
      if (!fs.existsSync(packagePath)) {
        throw new Error('package.json del sistema de scraping no encontrado');
      }
      
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const requiredDeps = ['express', 'puppeteer', 'cheerio', 'axios'];
      const missing = requiredDeps.filter(dep => !pkg.dependencies[dep]);
      
      if (missing.length > 0) {
        throw new Error(`Dependencias faltantes en scraping-system: ${missing.join(', ')}`);
      }
      
      return '✅ Dependencias del sistema de scraping correctas';
    }
  },
  {
    name: 'Estructura de directorios',
    check: () => {
      const dirs = [
        'client/src',
        'server',
        'scraping-system/api',
        'scraping-system/scrapers',
        'scraping-system/utils'
      ];
      
      const missing = dirs.filter(dir => !fs.existsSync(dir));
      
      if (missing.length > 0) {
        throw new Error(`Directorios faltantes: ${missing.join(', ')}`);
      }
      
      return '✅ Estructura de directorios correcta';
    }
  }
];

async function runChecks() {
  let allPassed = true;
  
  for (const check of checks) {
    try {
      console.log(`🔧 ${check.name}:`);
      const result = check.check();
      console.log(`   ${result}\n`);
    } catch (error) {
      console.log(`   ❌ ${error.message}\n`);
      allPassed = false;
    }
  }
  
  if (allPassed) {
    console.log('🎉 ¡Todas las verificaciones pasaron!');
    console.log('✨ El sistema está listo para iniciarse con: npm run start\n');
    
    console.log('📋 Servicios que se iniciarán:');
    console.log('   - Frontend (React + Vite): http://localhost:5173');
    console.log('   - Backend (Express + DB): http://localhost:3000');
    console.log('   - Sistema de Scraping: http://localhost:3001');
    
    return true;
  } else {
    console.log('❌ Algunas verificaciones fallaron. Por favor corrige los errores antes de continuar.');
    return false;
  }
}

// Ejecutar verificaciones
runChecks().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Error durante la verificación:', error);
  process.exit(1);
});
