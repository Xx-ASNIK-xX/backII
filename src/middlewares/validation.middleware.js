export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

export const validateProduct = (req, res, next) => {
    try {
        const { title, description, code, price, stock, category, status } = req.body;

        if (!title || typeof title !== 'string') {
            throw new ValidationError('El título es requerido y debe ser texto');
        }

        if (!description || typeof description !== 'string') {
            throw new ValidationError('La descripción es requerida y debe ser texto');
        }

        if (!code || typeof code !== 'string') {
            throw new ValidationError('El código es requerido y debe ser texto');
        }

        if (!price || typeof price !== 'number' || price <= 0) {
            throw new ValidationError('El precio es requerido y debe ser un número mayor a 0');
        }

        if (typeof stock !== 'number' || stock < 0) {
            throw new ValidationError('El stock debe ser un número no negativo');
        }

        if (!category || typeof category !== 'string') {
            throw new ValidationError('La categoría es requerida y debe ser texto');
        }

        // Convertir el estado a booleano si viene como string
        if (status !== undefined) {
            req.body.status = status === true || status === 'true' || status === 'on';
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const validateId = (req, res, next) => {
    try {
        const id = req.params.id || req.params.pid;
        if (!id?.match(/^[0-9a-fA-F]{24}$/)) {
            throw new ValidationError('ID inválido');
        }
        next();
    } catch (error) {
        next(error);
    }
};

export const validateStock = (req, res, next) => {
    try {
        const { stock } = req.body;

        if (typeof stock !== 'number' || stock < 0) {
            throw new ValidationError('El stock debe ser un número no negativo');
        }

        next();
    } catch (error) {
        next(error);
    }
}; 