import UserService from '../services/user.service.js';
import Logger from '../utils/logger.js';

const userService = new UserService();

// Mostrar formulario de registro
const getRegister = (req, res) => {
    res.render('register');
};

// Procesar registro de usuario
const postRegister = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        // Validar existencia
        const existing = await userService.getUserByEmail(email);
        if (existing) {
            return res.status(400).render('register', { error: 'El email ya está registrado' });
        }
        // Definir rol
        const adminEmail = 'adminCoder@coder.com';
        const adminPass = process.env.ADMIN_PASSWORD;
        const role = (email === adminEmail && password === adminPass) ? 'admin' : 'usuario';
        // Crear usuario con rol
        const newUser = await userService.createUser({ first_name, last_name, email, age, password, role });
        // Guardar en sesión
        req.session.user = {
            id: newUser._id,
            first_name: newUser.first_name,
            email: newUser.email,
            role: newUser.role
        };
        res.redirect('/products');
    } catch (error) {
        Logger.error('Error en postRegister:', error);
        res.status(500).render('register', { error: 'Error al registrar usuario' });
    }
};

// Mostrar formulario de login
const getLogin = (req, res) => {
    res.render('login');
};

// Procesar login de usuario
const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.validateUser(email, password);
        if (!user) {
            return res.status(400).render('login', { error: 'Credenciales inválidas' });
        }
        // Determinar rol: forzar admin si coincide con credenciales especiales
        const adminEmail = 'adminCoder@coder.com';
        const adminPass = process.env.ADMIN_PASSWORD;
        const role = (email === adminEmail && password === adminPass) ? 'admin' : user.role;
        // Guardar en sesión
        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            email: user.email,
            role
        };
        res.redirect('/products');
    } catch (error) {
        Logger.error('Error en postLogin:', error);
        res.status(500).render('login', { error: 'Error al iniciar sesión' });
    }
};

// Cerrar sesión
const getLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            Logger.error('Error al cerrar sesión:', err);
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
};

export default {
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    getLogout
}; 