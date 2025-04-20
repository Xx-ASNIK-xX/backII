import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../../models/product.model.js';

// Configuración de __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Configuración de GridFS
const GridFSBucket = mongoose.mongo.GridFSBucket;
let bucket = null;

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'images'
        });
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
}

async function uploadImage(file) {
    return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(file.originalname, {
            contentType: file.mimetype
        });

        uploadStream.end(file.buffer);
        uploadStream.on('finish', () => {
            resolve(uploadStream.id);
        });
        uploadStream.on('error', reject);
    });
}

async function migrateImages() {
    try {
        await connectDB();

        const imagesDir = path.join(__dirname, '../public/images/motorcycles');
        const files = await fs.readdir(imagesDir);

        console.log(`Encontradas ${files.length} imágenes para migrar`);

        for (const file of files) {
            const filePath = path.join(imagesDir, file);
            const fileBuffer = await fs.readFile(filePath);
            
            // Crear un objeto similar al que crea multer
            const fileObject = {
                originalname: file,
                buffer: fileBuffer,
                mimetype: `image/${path.extname(file).slice(1)}`
            };

            // Subir la imagen a GridFS
            const imageId = await uploadImage(fileObject);
            console.log(`Imagen ${file} migrada con ID: ${imageId}`);

            // Actualizar productos que usen esta imagen
            const imagePath = `/images/motorcycles/${file}`;
            await Product.updateMany(
                { thumbnails: imagePath },
                { $set: { "thumbnails.$": `/api/images/${imageId}` } }
            );
        }

        console.log('Migración completada');
        process.exit(0);
    } catch (error) {
        console.error('Error durante la migración:', error);
        process.exit(1);
    }
}

migrateImages(); 