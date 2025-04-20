import express from 'express';
import multer from 'multer';
import { uploadImage, getImage, deleteImage } from '../controllers/image.controller.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configurar multer para almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('Solo se permiten imágenes'), false);
            return;
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
}).array('images', 2);

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'El archivo es demasiado grande. Máximo 5MB'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                status: 'error',
                message: 'Demasiados archivos. Máximo 2 imágenes'
            });
        }
    }
    next(err);
};

// Ruta para subir imágenes
router.post('/upload', (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Error en multer:', err);
            return res.status(400).json({
                status: 'error',
                message: err.message || 'Error al subir las imágenes'
            });
        }

        try {
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se proporcionaron imágenes'
                });
            }

            const uploadPromises = req.files.map(file => uploadImage(file));
            const imageIds = await Promise.all(uploadPromises);
            
            const urls = imageIds.map(id => `/api/images/${id}`);
            
            res.json({
                status: 'success',
                urls: urls
            });
        } catch (error) {
            console.error('Error al procesar las imágenes:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al procesar las imágenes'
            });
        }
    });
});

// Ruta para obtener una imagen
router.get('/:imageId', getImage);

// Ruta para eliminar una imagen
router.delete('/:imageId', deleteImage);

export default router; 