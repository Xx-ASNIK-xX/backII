import ProductModel from '../models/product.model.js';
import Logger from '../utils/logger.js';

const socketEvents = (io) => {
    io.on('connection', async (socket) => {
        Logger.info('Nuevo cliente conectado');

        try {
            // Enviar productos al cliente cuando se conecta
            const products = await ProductModel.find().lean();
            socket.emit('products', products);

            // Manejar evento de nuevo producto
            socket.on('new-product', async (data) => {
                try {
                    const newProduct = await ProductModel.create(data);
                    io.emit('productCreated', newProduct);
                } catch (error) {
                    Logger.error('Error al crear nuevo producto:', error);
                    socket.emit('error', { message: 'Error al crear el producto' });
                }
            });

            // Manejar evento de actualización de producto
            socket.on('update-product', async (data) => {
                try {
                    const { id, ...updateData } = data;
                    const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
                    io.emit('productUpdated', updatedProduct);
                } catch (error) {
                    Logger.error('Error al actualizar producto:', error);
                    socket.emit('error', { message: 'Error al actualizar el producto' });
                }
            });

            // Manejar evento de eliminación de producto
            socket.on('delete-product', async (productId) => {
                try {
                    await ProductModel.findByIdAndDelete(productId);
                    io.emit('productDeleted', productId);
                } catch (error) {
                    Logger.error('Error al eliminar producto:', error);
                    socket.emit('error', { message: 'Error al eliminar el producto' });
                }
            });

        } catch (error) {
            Logger.error('Error al obtener productos:', error);
            socket.emit('error', { message: 'Error al cargar los productos' });
        }

        socket.on('disconnect', () => {
            Logger.info('Cliente desconectado');
        });
    });
};

export default socketEvents; 