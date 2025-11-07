// scripts/set-env.js
const fs = require('fs');
const path = require('path');

console.log('🔧 CONFIGURANDO ENTORNO DINÁMICO');

const projectRoot = process.cwd();
const env = process.env.NODE_ENV || 'dev';
const targetPath = path.join(projectRoot, 'src', 'environments', `environment.${env}.ts`);

// URL de la API dinámica según el entorno
let apiUrl = 'http://localhost:8080/api'; // default

if (process.env.API_URL) {
  apiUrl = process.env.API_URL;
} else if (env === 'production') {
  apiUrl = '/api'; 
} else if (env === 'dev') {
  apiUrl = 'http://localhost:8080/api';
}

const envConfig = `export const environment = {
  production: ${env === 'production'},
  apiUrl: '${apiUrl}'
};
`;

// Asegurar directorio
const dir = path.dirname(targetPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(targetPath, envConfig);
console.log(`✅ Environment configurado: ${targetPath}`);
console.log(`🌐 API URL: ${apiUrl}`);