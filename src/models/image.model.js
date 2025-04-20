import mongoose from 'mongoose';
const { GridFSBucket } = mongoose.mongo;

class ImageModel {
    constructor() {
        this.bucket = null;
    }

    async initialize() {
        if (!this.bucket) {
            this.bucket = new GridFSBucket(mongoose.connection.db, {
                bucketName: 'images'
            });
        }
    }

    async uploadImage(file) {
        await this.initialize();
        return new Promise((resolve, reject) => {
            const uploadStream = this.bucket.openUploadStream(file.originalname, {
                contentType: file.mimetype
            });

            // Manejar el buffer directamente
            uploadStream.end(file.buffer);

            uploadStream.on('finish', () => {
                resolve(uploadStream.id);
            });
            
            uploadStream.on('error', (error) => {
                console.error('Error en el stream de subida:', error);
                reject(error);
            });
        });
    }

    async getImage(imageId) {
        await this.initialize();
        try {
            return this.bucket.openDownloadStream(new mongoose.Types.ObjectId(imageId));
        } catch (error) {
            console.error('Error al abrir el stream de descarga:', error);
            throw error;
        }
    }

    async deleteImage(imageId) {
        await this.initialize();
        try {
            await this.bucket.delete(new mongoose.Types.ObjectId(imageId));
        } catch (error) {
            console.error('Error al eliminar la imagen:', error);
            throw error;
        }
    }
}

export default new ImageModel(); 