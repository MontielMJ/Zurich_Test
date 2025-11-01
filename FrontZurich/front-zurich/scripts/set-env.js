const fs = require('fs');
const path = require('path');

// Determinar entorno - mapear 'dev' a 'development'
let env = process.env.NODE_ENV || 'development';

// Si usan 'dev' en los comandos, mapear a 'development'
if (env === 'dev') {
  env = 'development';
  process.env.NODE_ENV = 'development';
}

console.log('🔧 CONFIGURANDO ENTORNO:', env.toUpperCase());
console.log('========================');

// Cargar variables según el entorno
const envFiles = [
  '.env',
  `.env.${env}`,
  `.env.dev`,
  '.env.development'
];

let envLoaded = false;
envFiles.forEach(envFile => {
  const envPath = path.join(__dirname, envFile);
  if (fs.existsSync(envPath) && !envLoaded) {
    require('dotenv').config({ path: envPath });
    console.log(`📥 CARGADO: ${envFile}`);
    envLoaded = true;
  }
});

if (!envLoaded) {
  require('dotenv').config();
  console.log('📥 CARGADO: .env (base)');
}

// Mostrar variables cargadas
console.log('\n🔑 VARIABLES CARGADAS:');
console.log('=====================');
console.log(`API_URL: ${process.env.API_URL || 'No definida'}`);
if (process.env.API_KEY) {
  console.log(`API_KEY: ***${process.env.API_KEY.slice(-4)}`);
} else {
  console.log('API_KEY: No definida');
}

// Generar environment.dev.ts para desarrollo
const devEnvironmentContent = `// Archivo generado automáticamente - No editar manualmente
// Entorno: ${env}
// Generado: ${new Date().toISOString()}
export const environment = {
  production: false,
  apiUrl: '${process.env.API_URL || 'http://localhost:3000/api'}',
  apiKey: '${process.env.API_KEY || 'dev-key-default'}',
  version: '${process.env.APP_VERSION || '1.0.0'}',
  buildDate: '${new Date().toISOString()}',
  environment: '${env}'
};
`;

// Generar environment.prod.ts para producción
const prodEnvironmentContent = `// Archivo generado automáticamente - No editar manualmente  
// Entorno: production
// Generado: ${new Date().toISOString()}
export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL || 'https://api.zurich.com/api'}',
  apiKey: '${process.env.API_KEY || 'prod-key-default'}',
  version: '${process.env.APP_VERSION || '1.0.0'}',
  buildDate: '${new Date().toISOString()}',
  environment: 'production'
};
`;

// Escribir archivos
const devPath = path.join(__dirname, 'src', 'environments', 'environment.dev.ts');
const prodPath = path.join(__dirname, 'src', 'environments', 'environment.prod.ts');

fs.writeFileSync(devPath, devEnvironmentContent);
fs.writeFileSync(prodPath, prodEnvironmentContent);

console.log('\n✅ ARCHIVOS GENERADOS:');
console.log('====================');
console.log(`📍 Dev: ${devPath}`);
console.log(`📍 Prod: ${prodPath}`);