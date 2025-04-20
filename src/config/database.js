import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Logger from '../utils/logger.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        Logger.info('Conexión a MongoDB establecida con éxito');
    } catch (error) {
        Logger.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB; 