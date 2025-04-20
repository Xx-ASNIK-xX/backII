import ProductService from '../services/product.service.js';
import Logger from '../utils/logger.js';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/error.constants.js';
import { io } from '../app.js';

const productService = new ProductService();

export const getProducts = async (req, res, next) => {
    try {
        Logger.info('Obteniendo lista de productos');
        const result = await productService.getProducts(req.query);
        res.status(HTTP_STATUS.OK).json({ status: 'success', payload: result });
    } catch (error) {
        Logger.error('Error al obtener productos:', error);
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        Logger.info(`Buscando producto con ID: ${req.params.id}`);
        const product = await productService.getProductById(req.params.id);
        res.status(HTTP_STATUS.OK).json({ status: 'success', payload: product });
    } catch (error) {
        Logger.error(`Error al obtener producto ${req.params.id}:`, error);
        next(error);
    }
};

export const createProduct = async (req, res) => {
    try {
        Logger.info('Iniciando creación de producto', { 
            body: req.body,
            files: req.files?.length || 0
        });

        // Preparar los datos del producto
        const productData = {
            ...req.body,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            status: req.body.status === true || req.body.status === 'true' || req.body.status === 'on'
        };

        // Crear el producto usando el servicio
        const newProduct = await productService.createProduct(productData, req.files);
        
        // Emitir evento de Socket.IO
        io.emit('productCreated', newProduct);
        
        res.status(201).json({
            status: 'success',
            message: 'Producto creado exitosamente',
            data: newProduct
        });
    } catch (error) {
        Logger.error('Error al crear producto:', { 
            error: error.message, 
            stack: error.stack,
            body: req.body,
            files: req.files 
        });

        // Determinar el código de estado apropiado
        let statusCode = 500;
        let errorMessage = 'Error interno del servidor';

        if (error.message.includes('Ya existe un producto con ese código')) {
            statusCode = 400;
            errorMessage = error.message;
        } else if (error.message.includes('Error al subir imagen')) {
            statusCode = 400;
            errorMessage = error.message;
        }
        
        res.status(statusCode).json({ 
            status: 'error',
            error: errorMessage
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        Logger.info(`Actualizando producto con ID: ${req.params.id}`, {
            body: req.body,
            files: req.files?.length || 0
        });

        // Preparar los datos del producto
        const productData = {
            ...req.body,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            status: typeof req.body.status === 'boolean' ? req.body.status : req.body.status === 'true'
        };

        // Actualizar el producto usando el servicio
        const updatedProduct = await productService.updateProduct(req.params.id, productData);
        
        // Emitir evento de Socket.IO
        io.emit('productUpdated', updatedProduct);
        
        res.status(200).json({
            status: 'success',
            message: 'Producto actualizado exitosamente',
            data: updatedProduct
        });
    } catch (error) {
        Logger.error('Error al actualizar producto:', { 
            error: error.message, 
            stack: error.stack,
            body: req.body,
            files: req.files 
        });

        // Determinar el código de estado apropiado
        let statusCode = 500;
        let errorMessage = 'Error interno del servidor';

        if (error.message.includes('Producto no encontrado')) {
            statusCode = 404;
            errorMessage = error.message;
        }
        
        res.status(statusCode).json({ 
            status: 'error',
            error: errorMessage
        });
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        Logger.info(`Eliminando producto con ID: ${req.params.id}`);
        const deletedProduct = await productService.deleteProduct(req.params.id);
        io.emit('productDeleted', req.params.id);
        res.status(HTTP_STATUS.OK).json({ status: 'success', payload: deletedProduct });
    } catch (error) {
        Logger.error(`Error al eliminar producto ${req.params.id}:`, error);
        next(error);
    }
};

export const updateStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        Logger.info(`Actualizando stock del producto ${id} a ${stock} unidades`);
        
        const updatedProduct = await productService.updateStock(id, stock);
        
        // Emitir evento de actualización de stock
        Logger.info('Emitiendo evento stockUpdate:', {
            productId: id,
            stock: updatedProduct.stock
        });
        
        io.emit('stockUpdate', {
            productId: id,
            stock: updatedProduct.stock
        });

        res.status(HTTP_STATUS.OK).json({ 
            status: 'success', 
            payload: updatedProduct 
        });
    } catch (error) {
        Logger.error(`Error al actualizar stock del producto ${req.params.id}:`, error);
        next(error);
    }
};