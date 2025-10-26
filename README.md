✨ Características Principales

              🎯 Frontend Moderno: Angular 17 con Angular Material
              
              🔧 Backend Robusto: .NET 8 Web API
              
              🗄️ Base de Datos: SQL Server 2022
              
              🐳 Containerización: Docker & Docker Compose
              
              🔐 Autenticación Segura: JWT Tokens
              
              👥 Gestión Completa: Clientes, Pólizas, Usuarios y Roles
              
              📱 Responsive Design: Interfaz adaptable


📋 Tabla de Contenidos
              Requisitos Previos
              
              Instalación Rápida
              
              Estructura del Proyecto
              
              Configuración
              
              Uso del Sistema
              
              API Reference
              
              Desarrollo
              
              Troubleshooting

🛠️ Requisitos Previos
              Docker
              
              Docker Compose
              
              Git
              
              4GB RAM mínimo

              2GB espacio libre en disco

🚀 Instalación Rápida

            Clonar el Repositorio
                    git clone https://github.com/tu-usuario/zurich-insurance-system.git
                    cd zurich-insurance-system
            Despliegue Automático
            
                    docker-compose up -d
                    docker-compose ps

Acceder a la Aplicación

            Frontend: http://localhost:3000

            API: http://localhost:8080

            SQL Server: localhost:1434

🐳 Servicios Docker

          sqlserver	mcr.microsoft.com/mssql/server:2022-latest	✅ Healthy	-
          db-init	mcr.microsoft.com/mssql-tools	✅ Completed	sqlserver
          api	Custom .NET 8	✅ Running	sqlserver, db-init
          frontend	Custom Angular	✅ Running	api
          
Credenciales de Acceso

            Rol	    Usuario	Contraseña	Permisos
        🔧 Admin	jmontiel	 123456	    Gestión completa
        👤 Client	cmontiel	 123456	    Solo consultas
Flujo de Trabajo
          Iniciar Sesión

          http://localhost:3000/login
          
          Gestión de Clientes (Solo Admin)
          Crear nuevos clientes
          Editar información existente
          
          Gestionar estado activo/inactivo
          Gestión de Pólizas        
          Crear pólizas asociadas a clientes
          
          Configurar tipos y coberturas
          
          Monitorear vencimientos
          
Problemas Comunes y Soluciones

          Problema	                        Solución
          SQL Server no inicia	      docker-compose logs sqlserver
          Script BD no ejecuta	      Verificar permisos de archivos en initdb/
          API no conecta a BD	      Revisar string de conexión y health checks
          Frontend no carga	          docker-compose build frontend --no-cache
          Puertos ocupados	          Cambiar puertos en docker-compose.yml

Comandos de Diagnóstico

          Ver estado de servicios
                      docker-compose ps
                    
          Ver logs específicos
                    docker-compose logs api
                    docker-compose logs frontend
                    docker-compose logs sqlserver
          
          Ver uso de recursos
                    docker stats
          
          Conectar a BD manualmente
                    docker exec -it zurich_sql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Zur1chDB2025 -d ZurichDB
                    Reset Completo
                    
          Detener y eliminar todo
                    docker-compose down -v
                    
          Limpiar Docker
                    docker system prune -f
          
           Reconstruir desde cero
                    docker-compose build --no-cache
                    docker-compose up -d
