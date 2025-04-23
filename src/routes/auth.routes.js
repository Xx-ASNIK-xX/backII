import { Router } from 'express';
import passport from 'passport';
import { register, login, getCurrentUser, verifyUser } from '../controllers/auth.controller.js';

const router = Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/current', 
    passport.authenticate('current', { session: false }),
    getCurrentUser
);

export default router; 