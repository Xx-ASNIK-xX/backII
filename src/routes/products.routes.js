import { Router } from 'express';
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    updateStock 
} from '../controllers/products.controller.js';
import { validateProduct, validateId, validateStock } from '../middlewares/validation.middleware.js';

const router = Router();

// Rutas GET
router.get('/', getProducts);
router.get('/:id', validateId, getProductById);

// Ruta POST para crear un nuevo producto
router.post('/', validateProduct, createProduct);

// Ruta PUT para actualizar un producto
router.put('/:id', validateId, validateProduct, updateProduct);

// Ruta para actualizar el stock de un producto
router.put('/:id/stock', validateId, validateStock, updateStock);

// Ruta DELETE para eliminar un producto
router.delete('/:id', validateId, deleteProduct);

export default router;