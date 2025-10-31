const fs = require('fs');
const path = require('path');

// Determinar el entorno
const env = process.env.NODE_ENV || 'development';
console.log('🔄 Configurando entorno:', env);

// Cargar variables de entorno
const envFiles = [
  '.env',
  `.env.${env}`,
  `.env.local`,
  `.env.${env}.local`
];

envFiles.forEach(envFile => {
  const envPath = path.resolve(process.cwd(), envFile);
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    console.log(`📁 Variables cargadas desde: ${envFile}`);
  }
});

// Validar variables requeridas
const requiredVars = ['API_URL', 'API_KEY'];
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`⚠️  Advertencia: ${varName} no está definida`);
  }
});

// Generar contenido para environment.ts
const environmentContent = `export const environment = {
  production: ${env === 'production'},
  apiUrl: '${process.env.API_URL || 'http://localhost:7128/api'}',
  apiKey: '${process.env.API_KEY || 'default-key'}',
  version: '${process.env.APP_VERSION || '1.0.0'}',
  environment: '${env}'
};`;

// Ruta del archivo a generar
const environmentPath = path.join(__dirname, '../src/environments/environment.ts');

// Crear directorio si no existe
const envDir = path.dirname(environmentPath);
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Escribir archivo
fs.writeFileSync(environmentPath, environmentContent);
console.log('✅ environment.ts generado correctamente');
console.log('📍 Ubicación:', environmentPath);
console.log('🔑 API_URL:', process.env.API_URL || 'No definida');