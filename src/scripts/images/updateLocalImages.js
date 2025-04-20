import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../../models/product.model.js';

dotenv.config();

const updates = [
    {
        code: "TRX450R",
        images: [
            "/images/motorcycles/TRX450R 1.jpeg",
            "/images/motorcycles/TRX450R 2.webp"
        ]
    },
    {
        code: "YFZ450R",
        images: [
            "/images/motorcycles/YFZ450R 1.jpeg",
            "/images/motorcycles/YFZ450R 2.jpeg"
        ]
    },
    {
        code: "NINJA400",
        images: [
            "/images/motorcycles/NINJA400 1.jpeg",
            "/images/motorcycles/NINJA400 2.webp"
        ]
    },
    {
        code: "MONSTER821",
        images: [
            "/images/motorcycles/MONSTER821 1.jpeg",
            "/images/motorcycles/MONSTER821 2.jpeg"
        ]
    },
    {
        code: "S1000RR",
        images: [
            "/images/motorcycles/S1000RR 1.JPG",
            "/images/motorcycles/S1000RR 2.jpg"
        ]
    },
    {
        code: "HCBR1000",
        images: [
            "/images/motorcycles/HCBR1000 1.jpg",
            "/images/motorcycles/HCBR1000 2.jpeg"
        ]
    },
    {
        code: "DPV4S",
        images: [
            "/images/motorcycles/DPV4S 1.jpg",
            "/images/motorcycles/DPV4S 2.jpeg"
        ]
    },
    {
        code: "KNZ10R",
        images: [
            "/images/motorcycles/KNZ10R 1.jpeg",
            "/images/motorcycles/KNZ10R 2.jpg"
        ]
    },
    {
        code: "ARSV4F",
        images: [
            "/images/motorcycles/ARSV4F 1.jpeg",
            "/images/motorcycles/ARSV4F 2.jpeg"
        ]
    },
    {
        code: "SGSX1000R",
        images: [
            "/images/motorcycles/SGSX1000R 1.jpg",
            "/images/motorcycles/SGSX1000R 2.webp"
        ]
    },
    {
        code: "MVF4RC",
        images: [
            "/images/motorcycles/MVF4RC 1.jpg",
            "/images/motorcycles/MVF4RC 2.jpeg"
        ]
    },
    {
        code: "KRC8C",
        images: [
            "/images/motorcycles/KRC8C 1.webp",
            "/images/motorcycles/KRC8C 2.jpeg"
        ]
    },
    {
        code: "TST1200RS",
        images: [
            "/images/motorcycles/TST1200RS 1.webp",
            "/images/motorcycles/TST1200RS 2.jpg"
        ]
    },
    {
        code: "DSFV4S",
        images: [
            "/images/motorcycles/DSFV4S 1.webp",
            "/images/motorcycles/DSFV4S 2.webp"
        ]
    },
    {
        code: "BM1000RR",
        images: [
            "/images/motorcycles/BM1000RR 1.jpeg",
            "/images/motorcycles/BM1000RR 2.jpg"
        ]
    }
];

async function updateImages() {
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

updateImages(); 