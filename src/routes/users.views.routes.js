import { Router } from 'express';
import usersViewsController from '../controllers/users.views.controller.js';
import { authJwt, forwardAuthenticated } from '../middlewares/jwt.middleware.js';
import bcrypt from 'bcrypt';

const router = Router();

// Formularios de login y vista actual
router.get('/login', forwardAuthenticated, usersViewsController.getLoginView);
router.post('/login', forwardAuthenticated, usersViewsController.postLoginView);
router.get('/current', authJwt, usersViewsController.getCurrentView);
router.get('/logout', usersViewsController.getLogoutView);

export default router; 