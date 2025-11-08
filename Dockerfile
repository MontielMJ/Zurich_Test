# ================================
# Etapa 1: Build
# ================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copiar archivos de proyecto y restaurar dependencias
COPY Zurich_Test.sln ./
COPY Application/Application.csproj ./Application/
COPY Domain/Domain.csproj ./Domain/
COPY Infrastructure/Infrastructure.csproj ./Infrastructure/
COPY Zurich_API/Zurich_API.csproj ./Zurich_API/

RUN dotnet restore Zurich_API/Zurich_API.csproj

# Copiar todo el código y compilar
COPY . .
WORKDIR /app/Zurich_API
RUN dotnet publish -c Release -o /out

# ================================
# Etapa 2: Runtime
# ================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copiar el resultado del build
COPY --from=build /out .

# Exponer el puerto de la API
# Escuchar en el puerto dinámico de Render
ENV ASPNETCORE_URLS=http://+:${PORT}
EXPOSE 8080

# Comando de inicio
ENTRYPOINT ["dotnet", "Zurich_API.dll"]
