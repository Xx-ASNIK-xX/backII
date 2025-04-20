export const ERROR_MESSAGES = {
    PRODUCT: {
        NOT_FOUND: 'Producto no encontrado',
        INVALID_DATA: 'Datos del producto inválidos',
        STOCK_UNAVAILABLE: 'Stock no disponible',
        DUPLICATE_CODE: 'Ya existe un producto con ese código'
    },
    CART: {
        NOT_FOUND: 'Carrito no encontrado',
        PRODUCT_NOT_FOUND: 'Producto no encontrado en el carrito',
        INVALID_QUANTITY: 'Cantidad inválida'
    },
    AUTH: {
        UNAUTHORIZED: 'No autorizado',
        INVALID_CREDENTIALS: 'Credenciales inválidas'
    },
    VALIDATION: {
        INVALID_ID: 'ID inválido',
        REQUIRED_FIELD: 'Campo requerido',
        INVALID_TYPE: 'Tipo de dato inválido'
    }
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}; 