import CartManagerClass from '../managers/CartManager.js';
import mongoose from 'mongoose';

const cartManager = new CartManagerClass();

// Validar ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

export const getCarts = async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json({ status: 'success', payload: carts });
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
};

export const getCartById = async (req, res) => {
    try {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ 
                status: 'error', 
                error: 'ID de carrito inválido' 
            });
        }

        const cart = await cartManager.getCartById(cid);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(404).json({ status: 'error', error: error.message });
    }
};

export const createCart = async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(400).json({ status: 'error', error: error.message });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ 
                status: 'error', 
                error: 'IDs de carrito y/o producto inválidos' 
            });
        }

        const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(400).json({ status: 'error', error: error.message });
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ 
                status: 'error', 
                error: 'IDs de carrito y/o producto inválidos' 
            });
        }

        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(400).json({ status: 'error', error: error.message });
    }
};

export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            return res.status(400).json({ 
                status: 'error', 
                error: 'IDs de carrito y/o producto inválidos' 
            });
        }

        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
        res.status(400).json({ status: 'error', error: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ 
                status: 'error', 
                error: 'ID de carrito inválido' 
            });
        }

        const updatedCart = await cartManager.clearCart(cid);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error al vaciar carrito:', error);
        res.status(400).json({ status: 'error', error: error.message });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ 
                status: 'error', 
                error: 'ID de carrito inválido' 
            });
        }

        const deletedCart = await cartManager.deleteCart(cid);
        res.json({ status: 'success', payload: deletedCart });
    } catch (error) {
        console.error('Error al eliminar carrito:', error);
        res.status(400).json({ status: 'error', error: error.message });
    }
};

export const updateCart = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ 
                status: 'error', 
                error: 'El campo products debe ser un array' 
            });
        }

        const updatedCart = await cartManager.updateCart(cid, products);
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        next(error);
    }
};