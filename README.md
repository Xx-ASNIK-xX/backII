# 🏍️ E-commerce de Motos - Backend API

## 📝 Descripción
Este proyecto es un e-commerce backend desarrollado con Node.js, Express y MongoDB, enfocado en la venta de motocicletas. Implementa una API RESTful con funcionalidades de productos y carrito de compras, incluyendo WebSockets para actualizaciones en tiempo real.

## 🎯 Objetivos Alcanzados
- Implementación de API RESTful completa
- Integración con MongoDB para persistencia de datos
- Sistema de carrito de compras funcional
- Actualizaciones en tiempo real con WebSockets
- Interfaz de usuario con Handlebars
- Manejo robusto de errores
- Validaciones de datos
- Paginación y filtros de productos

## 🛠️ Tecnologías Utilizadas
- Node.js
- Express
- MongoDB
- Mongoose
- Socket.IO
- Handlebars
- Bootstrap

## 📦 Estructura del Proyecto
```
src/
├── config/
│   └── database.js
├── controllers/
│   ├── products.controller.js
│   └── carts.controller.js
├── models/
│   ├── product.model.js
│   └── cart.model.js
├── routes/
│   ├── products.routes.js
│   ├── carts.routes.js
│   └── views.routes.js
├── views/
│   ├── products.handlebars
│   ├── cart.handlebars
│   └── realtimeproducts.handlebars
├── websocket/
│   └── socket.js
├── services/          # Nueva capa de servicios
├── dto/               # Data Transfer Objects
├── constants/         # Constantes y enumeraciones
├── utils/             # Utilidades y helpers
└── middlewares/       # Middlewares personalizados
└── app.js
```

## 🚀 Funcionalidades Implementadas

### Productos
- Listado con paginación
- Filtrado por categoría
- Ordenamiento por precio
- Búsqueda en tiempo real
- Gestión completa (CRUD)

### Carrito
- Agregar/eliminar productos
- Actualizar cantidades
- Cálculo de totales
- Persistencia de datos
- Validaciones de stock

### WebSockets
- Actualizaciones en tiempo real
- Notificaciones instantáneas
- Sincronización de datos

## 💡 Proceso de Desarrollo
1. Configuración inicial del proyecto y dependencias
2. Implementación de modelos y esquemas
3. Desarrollo de controladores y rutas
4. Integración de WebSockets
5. Creación de vistas con Handlebars
6. Implementación de validaciones y manejo de errores
7. Pruebas y depuración
8. Optimización y mejoras finales

## 🙏 Agradecimientos
Quiero expresar mi más sincero agradecimiento a los profesores que me guiaron en este proceso de aprendizaje:

- **Profesor Mauricio Gastón Lúquez**: Por su invaluable guía y paciencia en la enseñanza de los conceptos fundamentales de desarrollo backend.
- **Profesor adjunto Lucia Nerea Gigena**: Por compartir su experiencia y conocimientos en el desarrollo de aplicaciones web y por su apoyo constante y retroalimentación constructiva.

Este proyecto representa no solo un logro técnico, sino también el resultado de su dedicación y compromiso con la enseñanza.

## 📚 Aprendizajes Clave
- Arquitectura de aplicaciones backend
- Manejo de bases de datos NoSQL
- Comunicación en tiempo real
- Diseño de APIs RESTful
- Manejo de errores y validaciones
- Desarrollo de interfaces de usuario
- Trabajo con WebSockets

## 🎓 Conclusión
Este proyecto ha sido una experiencia enriquecedora que me permitió aplicar los conocimientos adquiridos en el curso y desarrollar habilidades prácticas en el desarrollo backend. La implementación de tecnologías modernas y mejores prácticas de desarrollo ha resultado en una aplicación robusta y escalable.

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.

## 🎨 Nuevas Funcionalidades

### Sistema de Imágenes
- Almacenamiento de imágenes en MongoDB usando GridFS
- Carrusel de imágenes para cada producto
- Visualización de múltiples imágenes por producto
- Navegación entre imágenes con flechas personalizadas
- Transición automática de imágenes

### Gestión de Productos
- Visualización detallada de productos
- Sistema de ordenamiento
- Paginación de resultados
- Actualización en tiempo real usando WebSockets
- Gestión completa de productos (CRUD)

### Base de Datos
- Integración con MongoDB Atlas
- Sistema GridFS para almacenamiento de imágenes
- Modelos optimizados para productos y usuarios
- Scripts de utilidad para gestión de datos

## 🚀 Scripts Disponibles

### Scripts del Cliente (`src/public/js/`)
- `realTimeProducts.js`: Actualización en tiempo real de productos

### Scripts de Utilidad (`src/scripts/`)
- **Data:**
  - `addMotorcycles.js`: Agrega nuevas motocicletas
  - `countProducts.js`: Estadísticas de productos
  - `listProducts.js`: Lista productos en consola
  - `updateSingleProduct.js`: Actualiza productos individuales
  - `migrate-data.js`: Migración y actualización de datos entre versiones

- **Images:**
  - `migrateImages.js`: Migra imágenes a GridFS
  - `updateRemainingBikes.js`: Actualiza imágenes pendientes
  - `updateLocalImages.js`: Actualiza rutas de imágenes locales

## 🚀 Instalación

1. Clonar el repositorio
```bash
git clone [https://github.com/Xx-ASNIK-xX/Back1]
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno en `.env`
```
MONGODB_URI=tu_uri_de_mongodb
PORT=8080
```

4. Iniciar el servidor
```bash
npm run dev
```

## 🚀 Uso

### Endpoints Principales

- `GET /products`: Lista de productos
- `GET /products/:id`: Detalle de producto
- `POST /products`: Crear producto
- `PUT /products/:id`: Actualizar producto
- `DELETE /products/:id`: Eliminar producto

### Gestión de Imágenes

- `GET /api/images/:imageId`: Obtener imagen
- `POST /api/images/upload`: Subir nueva imagen

## 🚀 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit los cambios
4. Push a la rama
5. Crear un Pull Request

## 📄 Licencia
Este proyecto está bajo la Licencia MIT.

## 🏗️ Mejoras Arquitectónicas Implementadas

### 1. Patrón de Capas (N-Layer)
- **Controllers**: Manejo de peticiones HTTP y respuestas

### 🎨 Últimas Mejoras Implementadas

#### Sistema de Notificaciones Mejorado
- Implementación de SweetAlert2 para notificaciones más atractivas
- Animaciones fluidas y profesionales
- Temporizadores personalizados para mejor experiencia de usuario
- Barras de progreso en notificaciones
- Notificaciones no intrusivas y auto-dismissibles

#### Gestión de Imágenes Mejorada
- Límite de 2 imágenes por producto
- Vista previa de imágenes antes de subir
- Validación de tamaño (máximo 5MB)
- Validación de tipo de archivo (solo imágenes)
- Capacidad de eliminar imágenes antes de subir
- Placeholder visual para agregar más imágenes

#### Mejoras en la Interfaz de Usuario
- Animaciones suaves en acciones CRUD
- Confirmaciones visuales para acciones importantes
- Feedback inmediato al usuario
- Integración con Font Awesome para iconografía
- Diseño responsive y moderno
- Mensajes de error más descriptivos y amigables

#### Sistema de Validaciones
- Validación en tiempo real de formularios
- Mensajes de error específicos y claros
- Prevención de duplicados en códigos de producto
- Validación de tipos de datos y formatos
- Manejo robusto de errores

#### Optimizaciones de Rendimiento
- Carga asíncrona de imágenes
- Optimización de llamadas al servidor
- Reducción de recargas innecesarias
- Mejor manejo de estado en tiempo real
- Cacheo eficiente de recursos

### 2. Data Transfer Objects (DTOs)
- Transformación de datos consistente
- Separación entre modelo de datos y respuestas API
- Sanitización de datos sensibles
- Optimización de respuestas

### 3. Sistema de Logging Centralizado
- Niveles: INFO, ERROR, WARN, DEBUG
- Timestamps en cada registro
- Stack trace en errores
- Filtrado por ambiente (development/production)

### 4. Manejo de Errores Mejorado
- Middleware centralizado de errores
- Errores personalizados por tipo
- Mensajes de error consistentes
- Códigos HTTP apropiados

### 5. Validaciones Robustas
- Middleware de validación por entidad
- Validación de tipos de datos
- Validación de IDs de MongoDB
- Manejo de casos borde

### 6. Constantes y Utilidades
- Mensajes de error centralizados
- Códigos HTTP estandarizados
- Funciones de utilidad reutilizables
- Configuraciones centralizadas

### 7. Estructura de Carpetas Mejorada
```
src/
├── services/          # Nueva capa de servicios
├── dto/               # Data Transfer Objects
├── constants/         # Constantes y enumeraciones
├── utils/             # Utilidades y helpers
└── middlewares/       # Middlewares personalizados
```

Estas mejoras hacen que el código sea:
- Más mantenible y escalable
- Más fácil de testear
- Más robusto y seguro
- Mejor organizado
- Más fácil de entender y modificar 