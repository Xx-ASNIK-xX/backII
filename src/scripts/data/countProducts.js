import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../models/product.model.js';

dotenv.config();

const countProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        // Contar total de productos
        const total = await ProductModel.countDocuments();
        console.log(`Total de productos: ${total}`);

        // Contar por categoría
        const porCategoria = await ProductModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\nProductos por categoría:');
        porCategoria.forEach(cat => {
            console.log(`${cat._id}: ${cat.count} productos`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

countProducts(); 