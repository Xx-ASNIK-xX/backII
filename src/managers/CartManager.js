import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';
import { io } from '../app.js';
import Logger from '../utils/logger.js';

class CartManager {
    async getCarts() {
        try {
            return await CartModel.find().populate('products.product').lean();
        } catch (error) {
            throw new Error(`Error al obtener carritos: ${error.message}`);
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id).populate('products.product').lean();
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            throw new Error(`Error al obtener carrito: ${error.message}`);
        }
    }

    async createCart() {
        try {
            const newCart = await CartModel.create({ products: [] });
            return newCart.toObject();
        } catch (error) {
            throw new Error(`Error al crear carrito: ${error.message}`);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            Logger.info(`Intentando agregar producto ${productId} al carrito ${cartId} con cantidad ${quantity}`);
            
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            // Buscar si el producto ya está en el carrito
            const existingProductIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );

            const currentQuantityInCart = existingProductIndex !== -1 ? cart.products[existingProductIndex].quantity : 0;
            
            // El stock total es el stock actual (lo que queda sin reservar)
            const totalStock = product.stock;
            Logger.debug('Verificación de stock:', {
                stockActual: totalStock,
                cantidadEnCarrito: currentQuantityInCart,
                cantidadSolicitada: quantity
            });

            // Verificar si podemos agregar más unidades
            if (quantity > totalStock) {
                throw new Error(`No hay suficiente stock disponible. Solo quedan ${totalStock} unidades sin reservar.`);
            }

            // Actualizar o agregar el producto al carrito
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity = currentQuantityInCart + quantity;
            } else {
                cart.products.push({
                    product: productId,
                    quantity: quantity
                });
            }

            // Actualizar el stock del producto
            product.stock = totalStock - quantity;
            
            await product.save();
            await cart.save();

            // Emitir evento de actualización de stock
            io.emit('stockUpdate', {
                productId: productId,
                stock: product.stock
            });

            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Encontrar el producto en el carrito
            const productInCart = cart.products.find(
                item => item.product.toString() === productId
            );

            if (productInCart) {
                // Restaurar el stock del producto
                const product = await ProductModel.findById(productId);
                if (product) {
                    product.stock += productInCart.quantity;
                    await product.save();

                    // Emitir evento de actualización de stock
                    io.emit('stockUpdate', {
                        productId: productId,
                        stock: product.stock
                    });
                }
            }

            cart.products = cart.products.filter(
                item => item.product.toString() !== productId
            );

            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error(`Error al eliminar producto del carrito: ${error.message}`);
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            if (quantity < 0) {
                throw new Error('La cantidad no puede ser negativa');
            }

            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );

            if (productIndex === -1) {
                throw new Error('Producto no encontrado en el carrito');
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const currentQuantity = cart.products[productIndex].quantity;

            if (quantity === 0) {
                // Si la cantidad es 0, eliminar el producto y restaurar stock
                const newStock = product.stock + currentQuantity;
                product.stock = newStock;
                cart.products.splice(productIndex, 1);
            } else {
                // Calcular la diferencia de stock necesaria
                const stockDifference = quantity - currentQuantity;
                
                // Si estamos aumentando la cantidad
                if (stockDifference > 0) {
                    // Verificar si hay suficiente stock disponible
                    if (stockDifference > product.stock) {
                        throw new Error(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles para agregar`);
                    }
                    product.stock -= stockDifference;
                } else {
                    // Si estamos reduciendo la cantidad, devolver al stock
                    product.stock += Math.abs(stockDifference);
                }
                
                // Verificar que el stock no sea negativo
                if (product.stock < 0) {
                    throw new Error('Error en la actualización del stock');
                }

                cart.products[productIndex].quantity = quantity;
            }

            await product.save();
            
            // Emitir evento de actualización de stock
            io.emit('stockUpdate', {
                productId: productId,
                stock: product.stock
            });

            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error(`Error al actualizar cantidad: ${error.message}`);
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Restaurar el stock de cada producto
            for (const item of cart.products) {
                const product = await ProductModel.findById(item.product._id);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                    
                    // Emitir evento de actualización de stock
                    io.emit('stockUpdate', {
                        productId: product._id.toString(),
                        stock: product.stock
                    });
                }
            }

            cart.products = [];
            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error(`Error al vaciar carrito: ${error.message}`);
        }
    }

    async deleteCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndDelete(cartId).lean();
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            throw new Error(`Error al eliminar carrito: ${error.message}`);
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Restaurar el stock de todos los productos en el carrito
            for (const item of cart.products) {
                const product = await ProductModel.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                    
                    // Emitir evento de actualización de stock
                    io.emit('stockUpdate', {
                        productId: product._id.toString(),
                        stock: product.stock
                    });
                }
            }

            // Vaciar el carrito
            cart.products = [];
            await cart.save();

            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error(`Error al vaciar el carrito: ${error.message}`);
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Restaurar el stock de los productos actuales
            for (const item of cart.products) {
                const product = await ProductModel.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                    
                    io.emit('stockUpdate', {
                        productId: product._id,
                        stock: product.stock
                    });
                }
            }

            // Validar y actualizar el stock de los nuevos productos
            for (const item of products) {
                const product = await ProductModel.findById(item.product);
                if (!product) {
                    throw new Error(`Producto ${item.product} no encontrado`);
                }
                if (product.stock < item.quantity) {
                    throw new Error(`Stock insuficiente para el producto ${product.title}`);
                }
                product.stock -= item.quantity;
                await product.save();
                
                io.emit('stockUpdate', {
                    productId: product._id,
                    stock: product.stock
                });
            }

            // Actualizar el carrito con los nuevos productos
            cart.products = products;
            await cart.save();

            return await this.getCartById(cartId);
        } catch (error) {
            throw new Error(`Error al actualizar carrito: ${error.message}`);
        }
    }
}

export default CartManager;