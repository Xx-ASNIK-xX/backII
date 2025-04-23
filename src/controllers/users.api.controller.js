import UserModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Logger from '../utils/logger.js';
import UserService from '../services/user.service.js';

// Crear instancia de servicio
const userService = new UserService();

const createUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, role, password } = req.body;
        // Verificar email único
        const exists = await userService.getUserByEmail(email);
        if (exists) {
            return res.status(400).json({ status: 'error', message: 'Email ya registrado' });
        }
        // Crear usuario junto a su carrito y rol por defecto
        const newUser = await userService.createUser({ first_name, last_name, email, age, password, role });
        res.status(201).json({ status: 'success', payload: { id: newUser._id, email: newUser.email } });
    } catch (error) {
        Logger.error('Error createUser API:', error);
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');
        res.json({ status: 'success', payload: users });
    } catch (error) {
        Logger.error('Error getAllUsers API:', error);
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id).select('-password');
        if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        res.json({ status: 'success', payload: user });
    } catch (error) {
        Logger.error('Error getUserById API:', error);
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (updateData.password) delete updateData.password; // no actualizar contraseña
        const result = await UserModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        if (!result) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        res.json({ status: 'success', payload: result });
    } catch (error) {
        Logger.error('Error updateUser API:', error);
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await UserModel.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        res.json({ status: 'success', message: 'Usuario eliminado' });
    } catch (error) {
        Logger.error('Error deleteUser API:', error);
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ status: 'error', message: 'Credenciales inválidas' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ status: 'error', message: 'Credenciales inválidas' });
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.cookie('currentUser', token, { httpOnly: true, signed: true });
        res.json({ status: 'success', message: 'Login exitoso' });
    } catch (error) {
        Logger.error('Error login API:', error);
        res.status(500).json({ status: 'error', message: 'Error en el servidor' });
    }
};

export default { createUser, getAllUsers, getUserById, updateUser, deleteUser, login }; 