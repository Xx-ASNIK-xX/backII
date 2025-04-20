import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../../models/product.model.js';

dotenv.config();

async function listProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        const products = await ProductModel.find({}).lean();
        
        products.forEach(product => {
            console.log(`\nTítulo: ${product.title}`);
            console.log(`Código: ${product.code}`);
            console.log(`Imágenes actuales:`, product.thumbnails);
            console.log('------------------------');
        });

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

listProducts(); 