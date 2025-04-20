import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../../models/product.model.js';

dotenv.config();

const updates = [
    {
        code: "YYZF-R1M",
        images: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        code: "BS1000RR",
        images: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        code: "MVF4RC",
        images: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        code: "KRC8C",
        images: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        code: "TST1200RS",
        images: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        code: "YMT10SP",
        images: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        code: "HCB1000R",
        images: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        code: "KZH2SE",
        images: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        code: "ATV4F",
        images: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        code: "MVB1000RR",
        images: [
            "img1.jpg", "img2.jpg"
        ]
    }
];

async function updateProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        for (const update of updates) {
            const result = await ProductModel.updateOne(
                { code: update.code },
                { $set: { thumbnails: update.images } }
            );
            console.log(`Producto ${update.code} actualizado:`, result.modifiedCount > 0 ? 'Sí' : 'No');
        }

        console.log('Actualización completada');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateProducts(); 