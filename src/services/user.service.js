import UserModel from '../models/user.model.js';
import CartModel from '../models/cart.model.js';
import Logger from '../utils/logger.js';

class UserService {
    async createUser(userData) {
        try {
            // Crear un carrito para el usuario
            const cart = await CartModel.create({ products: [] });
            
            // Crear el usuario con el ID del carrito
            const user = await UserModel.create({
                ...userData,
                cart: cart._id
            });

            Logger.info('Usuario creado exitosamente:', { userId: user._id });
            return user;
        } catch (error) {
            Logger.error('Error al crear usuario:', error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const user = await UserModel.findById(id).populate('cart');
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return user;
        } catch (error) {
            Logger.error('Error al obtener usuario:', error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            Logger.error('Error al buscar usuario por email:', error);
            throw error;
        }
    }

    async validateUser(email, password) {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                return null;
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return null;
            }

            return user;
        } catch (error) {
            Logger.error('Error al validar usuario:', error);
            throw error;
        }
    }
}

export default UserService; 