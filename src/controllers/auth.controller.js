import jwt from 'jsonwebtoken';
import UserService from '../services/user.service.js';
import Logger from '../utils/logger.js';

const userService = new UserService();

export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Crear nuevo usuario
        const newUser = await userService.createUser({
            first_name,
            last_name,
            email,
            age,
            password
        });

        // Generar token JWT
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        Logger.info('Usuario registrado exitosamente:', { userId: newUser._id });
        
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token
        });
    } catch (error) {
        Logger.error('Error en registro:', error);
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar usuario
        const user = await userService.validateUser(email, password);
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        Logger.info('Usuario logueado exitosamente:', { userId: user._id });
        
        res.json({
            message: 'Login exitoso',
            token
        });
    } catch (error) {
        Logger.error('Error en login:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        res.json({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        });
    } catch (error) {
        Logger.error('Error al obtener usuario actual:', error);
        res.status(500).json({ error: error.message });
    }
}; 