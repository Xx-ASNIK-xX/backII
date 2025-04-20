import Logger from '../utils/logger.js';

export const createProduct = async (req, res) => {
    try {
        const files = req.files;
        Logger.debug('Archivos recibidos:', files);

        const productData = req.body;
        Logger.info('Creando nuevo producto:', productData);

        const newProduct = await productService.createProduct(productData, files);
        Logger.info('Producto creado exitosamente:', newProduct);

        res.status(201).json(newProduct);
    } catch (error) {
        Logger.error('Error al crear el producto:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const updateData = req.body;
        Logger.info(`Actualizando producto ${pid}:`, updateData);

        const updatedProduct = await productService.updateProduct(pid, updateData);
        Logger.info('Producto actualizado exitosamente:', updatedProduct);

        res.json(updatedProduct);
    } catch (error) {
        Logger.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        Logger.info(`Eliminando producto ${pid}`);

        await productService.deleteProduct(pid);
        Logger.info(`Producto ${pid} eliminado exitosamente`);

        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        Logger.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: error.message });
    }
}; 