import Logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
    Logger.error('Error en la aplicación:', err.stack);

    // Errores de token expirado
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: 'error',
            error: 'Token expirado',
            message: 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.'
        });
    }

    // Errores de token inválido
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: 'error',
            error: 'Token inválido',
            message: 'El token proporcionado no es válido.'
        });
    }

    // Errores de validación de Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            error: 'Error de validación',
            details: Object.values(err.errors).map(e => e.message)
        });
    }

    // Errores de ID inválido de Mongoose
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({
            status: 'error',
            error: 'ID inválido',
            details: 'El formato del ID proporcionado no es válido'
        });
    }

    // Error personalizado con código de estado
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            status: 'error',
            error: err.message
        });
    }

    // Error por defecto
    res.status(500).json({
        status: 'error',
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
}; 