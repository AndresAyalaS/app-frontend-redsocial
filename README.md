# 🌐 Frontend - Red Social (Periferia IT)

Este proyecto es el frontend de una red social construida como parte de una prueba técnica. Está desarrollado con **React**, **TypeScript**, **Tailwind CSS**, **React Hook Form**, y **Zustand**. El sistema se comunica con un backend basado en microservicios mediante API REST con autenticación por **JWT**.

---

## 🛠️ Tecnologías utilizadas

- **React 18** con **TypeScript**
- **Tailwind CSS** para estilos modernos y responsivos
- **React Router Dom** para navegación entre vistas
- **React Hook Form** para validación de formularios
- **Zustand** para manejo global de estado
- **Vitest** y **@testing-library/react** para pruebas unitarias
- **Axios** para llamadas HTTP
- **Lucide React** para iconos SVG

---

## 🚀 Funcionalidades implementadas

### ✅ Autenticación
- Registro de usuarios
- Login con validaciones
- Guardado de sesión con JWT
- Redirección automática si el usuario ya está autenticado

### 👤 Perfil
- Visualización de información básica del usuario

### 📝 Publicaciones
- Crear publicaciones con validación (mínimo 5 caracteres)
- Listar publicaciones
- Dar "like" a publicaciones

### 🧪 Pruebas
- Pruebas unitarias para:
  - Formulario de Login
  - Formulario de Crear publicación
- Reporte de cobertura con Vitest

---

## 📂 Estructura de carpetas

src/
├── api/ # Llamadas a la API REST (auth, posts)
├── components/ # Componentes reutilizables (Header, Input, Button)
├── pages/ # Vistas principales (Login, Register, Profile, Posts, CreatePost)
├── store/ # Estado global (Zustand)
├── routes/ # Rutas protegidas y públicas
├── types/ # Tipos de datos globales (User, Post)
├── App.tsx # Rutas generales
└── main.tsx # Entrada principal


## Instalación y ejecución


### Instalar dependencias

npm install

### Ejecutar en desarrollo

npm run dev

La app estará disponible en http://localhost:5173


# Ejecutar pruebas

npx vitest run

## Ver cobertura

npx vitest run --coverage

#  Estilos
Este proyecto utiliza Tailwind CSS con una configuración personalizada y efectos modernos de interfaz como glassmorphism, gradientes y transiciones suaves.

#  Autor
Desarrollado por Andrés Ayala
