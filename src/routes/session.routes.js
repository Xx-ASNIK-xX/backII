import { Router } from 'express';
import sessionController from '../controllers/session.controller.js';
import { ensureAuthenticated, forwardAuthenticated } from '../middlewares/auth.middleware.js';

const router = Router();

// Vistas y procesamiento de registro
router.get('/register', forwardAuthenticated, sessionController.getRegister);
router.post('/register', forwardAuthenticated, sessionController.postRegister);

// Vistas y procesamiento de login
router.get('/login', forwardAuthenticated, sessionController.getLogin);
router.post('/login', forwardAuthenticated, sessionController.postLogin);

// Logout
router.get('/logout', ensureAuthenticated, sessionController.getLogout);

export default router; 