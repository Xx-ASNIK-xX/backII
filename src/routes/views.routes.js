import { Router } from 'express';
import viewsController from '../controllers/views.controller.js';

const router = Router();

// Vista Home
router.get('/', viewsController.getHomeView);

// Vista de productos en tiempo real
router.get('/realtimeproducts', viewsController.getRealTimeProductsView);

// Vista de productos con paginación
router.get('/products', viewsController.getProducts);

// Vista de detalle de producto
router.get('/products/:pid', viewsController.getProductDetail);

// Vista del carrito
router.get('/carts/:cid', viewsController.getCart);

export default router;