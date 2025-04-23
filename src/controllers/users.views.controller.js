import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import Logger from '../utils/logger.js';

// Mostrar formulario de login
const getLoginView = (req, res) => {
    const { error } = req.query;
    res.render('login', { error });
};

// Procesar login via formulario
const postLoginView = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.redirect('/users/login?error=Login failed!');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.redirect('/users/login?error=Login failed!');
        }
        const token = jwt.sign(
            { id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.cookie('currentUser', token, { httpOnly: true, signed: true });
        res.redirect('/users/current');
    } catch (error) {
        Logger.error('Error postLoginView:', error);
        res.redirect('/users/login?error=Login failed!');
    }
};

// Mostrar datos de usuario actual
const getCurrentView = (req, res) => {
    try {
        const token = req.signedCookies.currentUser;
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        res.render('current', { user: payload });
    } catch (error) {
        return res.redirect('/users/login?error=Login failed!');
    }
};

// Logout: limpiar cookie
const getLogoutView = (req, res) => {
    res.clearCookie('currentUser');
    res.redirect('/users/login');
};

export default {
    getLoginView,
    postLoginView,
    getCurrentView,
    getLogoutView
}; 