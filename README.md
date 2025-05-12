
# Aplicación de Registro de Usuarios

## Información del Proyecto

Esta aplicación permite registrar usuarios y visualizar la información de los usuarios registrados.

## Stack Tecnológico

Este proyecto está construido con:

- **Frontend**:
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn-ui (componentes de UI)
  - Vite (como bundler y herramienta de desarrollo)

- **Backend**:
  - Supabase (Base de datos PostgreSQL y autenticación)

## Base de Datos

El proyecto utiliza las siguientes tablas:

- **users**: Almacena información básica del usuario
- **contacts**: Información de contacto
- **countries**: Listado de países
- **document_types**: Tipos de documentos disponibles

## Características

- Registro de usuarios con validación de datos
- Visualización de usuarios registrados
- Interfaz de usuario moderna y responsive

## Cómo ejecutar el proyecto

Requisitos previos:
- Node.js & npm - [instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Sigue estos pasos:

```sh
# Paso 1: Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# Paso 2: Navegar al directorio del proyecto
cd <NOMBRE_DEL_PROYECTO>

# Paso 3: Instalar las dependencias necesarias
npm install

# Paso 4: Iniciar el servidor de desarrollo
npm run dev
```

## Variables de Entorno

El proyecto requiere las siguientes variables de entorno para conectarse a Supabase:

```
VITE_SUPABASE_URL=<URL_DE_TU_PROYECTO_SUPABASE>
VITE_SUPABASE_ANON_KEY=<CLAVE_ANONIMA_DE_SUPABASE>
```

## Desarrollo

Para contribuir al desarrollo:

1. Crear una rama para tu característica
2. Desarrollar y probar localmente
3. Crear un pull request para revisión
