# Scripts de Utilidad

Este directorio contiene scripts útiles para la gestión y mantenimiento de la aplicación.

## Estructura de Carpetas

```
scripts/
├── data/           # Scripts relacionados con datos y productos
├── images/         # Scripts para gestión de imágenes
└── utils/          # Scripts de utilidad general
```

## Scripts de Datos (/data)

### addMotorcycles.js
- **Propósito**: Agrega nuevas motocicletas a la base de datos
- **Uso**: `node src/scripts/data/addMotorcycles.js`
- **Descripción**: Agrega un conjunto predefinido de motocicletas con sus detalles completos

### countProducts.js
- **Propósito**: Cuenta y muestra estadísticas de productos
- **Uso**: `node src/scripts/data/countProducts.js`
- **Descripción**: Muestra el total de productos y su distribución por categorías

### updateSingleProduct.js
- **Propósito**: Actualiza un producto específico
- **Uso**: `node src/scripts/data/updateSingleProduct.js`
- **Descripción**: Permite actualizar los detalles de un producto individual

## Scripts de Imágenes (/images)

### migrateImages.js
- **Propósito**: Migra imágenes locales a MongoDB GridFS
- **Uso**: `node src/scripts/images/migrateImages.js`
- **Descripción**: Transfiere todas las imágenes de la carpeta local a la base de datos MongoDB

### updateImages.js
- **Propósito**: Actualiza las URLs de imágenes en productos
- **Uso**: `node src/scripts/images/updateImages.js`
- **Descripción**: Actualiza las referencias de imágenes en los productos

### updateRemainingBikes.js
- **Propósito**: Actualiza imágenes de motos pendientes
- **Uso**: `node src/scripts/images/updateRemainingBikes.js`
- **Descripción**: Script específico para actualizar las imágenes de motos que faltan en la base de datos
- **Funcionalidades**:
  - Busca motos por su código específico
  - Actualiza las imágenes usando archivos locales
  - Maneja múltiples motos en una sola ejecución
  - Verifica y actualiza las rutas de imágenes en MongoDB
  - Soporta diferentes formatos de imagen (jpg, jpeg, png, webp)
- **Motos Soportadas**:
  - Yamaha YZF-R1M
  - BMW S1000RR
  - KTM 1290 Super Duke R Evo
  - Suzuki Hayabusa
  - Y otras motos específicas del catálogo

## Scripts de Utilidad (/utils)

### testConnection.js
- **Propósito**: Prueba la conexión a MongoDB
- **Uso**: `node src/scripts/utils/testConnection.js`
- **Descripción**: Verifica la conexión a la base de datos MongoDB

## Notas Importantes

1. Asegúrate de tener la base de datos MongoDB en ejecución antes de usar estos scripts
2. Algunos scripts pueden requerir variables de entorno configuradas en `.env`
3. Es recomendable hacer una copia de seguridad de la base de datos antes de ejecutar scripts que modifiquen datos
4. Los scripts están diseñados para ser ejecutados desde la raíz del proyecto 