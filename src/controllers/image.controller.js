import imageModel from '../models/image.model.js';
import Logger from '../utils/logger.js';

export const uploadImage = async (file) => {
    try {
        const imageId = await imageModel.uploadImage(file);
        return imageId;
    } catch (error) {
        Logger.error('Error al subir la imagen:', error);
        throw error;
    }
};

export const getImage = async (req, res) => {
    try {
        const imageStream = await imageModel.getImage(req.params.imageId);
        // Configurar headers para la imagen
        res.set('Content-Type', 'image/jpeg');
        imageStream.pipe(res);
    } catch (error) {
        Logger.error('Error al obtener la imagen:', error);
        res.status(404).json({ error: 'Imagen no encontrada' });
    }
};

export const deleteImage = async (req, res) => {
    try {
        await imageModel.deleteImage(req.params.imageId);
        res.json({ success: true, message: 'Imagen eliminada exitosamente' });
    } catch (error) {
        Logger.error('Error al eliminar la imagen:', error);
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
}; 