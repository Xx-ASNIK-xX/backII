import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../../models/product.model.js';

dotenv.config();

const products = [
    {
        title: "Yamaha Fz",
        description: "Fi 3.0 / 149 cc ",
        code: "ABC123",
        price: 5720000,
        status: true,
        stock: 10,
        category: "motos",
        thumbnails: ["img1.jpg", "img2.jpg"]
    },
    {
        title: "Bajaj Dominar 400",
        description: "Tourer / 373 cc ",
        code: "ABC234",
        price: 7972500,
        status: true,
        stock: 5,
        category: "motos",
        thumbnails: ["img1.jpg", "img2.jpg"]
    },
    {
        title: "Honda Cb 300",
        description: "Naked / 293 cc",
        code: "DEF123",
        price: 8298000,
        status: true,
        stock: 8,
        category: "motos",
        thumbnails: ["img1.jpg", "img2.jpg"]
    },
    {
        title: "Benelli Leoncino 809",
        description: "Trail / 758 cc",
        code: "XYZ789",
        price: 17370000,
        status: true,
        stock: 4,
        category: "motos",
        thumbnails: ["img1.jpg", "img2.jpg"]
    }
];

const migrateData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conexión a MongoDB establecida');

        // Eliminar productos existentes
        await ProductModel.deleteMany({});
        console.log('Productos anteriores eliminados');

        // Insertar nuevos productos
        const result = await ProductModel.insertMany(products);
        console.log('Productos migrados exitosamente:', result.length, 'productos insertados');

        await mongoose.disconnect();
        console.log('Desconectado de MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('Error durante la migración:', error);
        process.exit(1);
    }
};

migrateData(); 