import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Ruta para validar token y devolver datos del usuario
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    // Solo devolver campos básicos no sensibles
    const { _id, first_name, last_name, email, role } = req.user;
    res.json({
        status: 'success',
        payload: { id: _id, first_name, last_name, email, role }
    });
});

export default router; 