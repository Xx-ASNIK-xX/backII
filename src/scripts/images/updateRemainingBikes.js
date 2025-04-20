import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../../models/product.model.js';

dotenv.config();

const updates = [
    {
        code: "YYZF-R1M",
        images: [
            "/images/motorcycles/YYZF-R1M 1.webp",
            "/images/motorcycles/YYZF-R1M 2.jpeg"
        ]
    },
    {
        code: "BS1000RR",
        images: [
            "/images/motorcycles/BS1000RR 1.jpeg",
            "/images/motorcycles/BS1000RR 2.jpeg"
        ]
    },
    {
        code: "YMT10SP",
        images: [
            "/images/motorcycles/YMT10SP 1.jpg",
            "/images/motorcycles/YMT10SP 2.jpg"
        ]
    },
    {
        code: "KZH2SE",
        images: [
            "/images/motorcycles/KZH2SE 1.jpg",
            "/images/motorcycles/KZH2SE 2.jpeg"
        ]
    },
    {
        code: "ATV4F",
        images: [
            "/images/motorcycles/ATV4F 2.jpg",
            "/images/motorcycles/ATV4F 2.jpg"
        ]
    },
    {
        code: "MVB1000RR",
        images: [
            "/images/motorcycles/MVB1000RR 1.jpg",
            "/images/motorcycles/MVB1000RR 2.jpg"
        ]
    },
    {
        code: "DMSP",
        images: [
            "/images/motorcycles/DMSP 1.png",
            "/images/motorcycles/DMSP 2.png"
        ]
    },
    {
        code: "KSDR1290E",
        images: [
            "/images/motorcycles/KSDR1290E 1.jpg",
            "/images/motorcycles/KSDR1290E 2.jpg"
        ]
    },
    {
        code: "SHAY2023",
        images: [
            "/images/motorcycles/SHAY2023 1.jpg",
            "/images/motorcycles/SHAY2023 2.jpeg"
        ]
    }
];

async function updateImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        // Primero, veamos qué motos existen y sus códigos actuales
        const products = await ProductModel.find({
            code: { 
                $in: updates.map(u => u.code)
            }
        }).lean();

        console.log('\nMotos encontradas:');
        products.forEach(p => {
            console.log(`${p.title} - Código: ${p.code}`);
        });

        // Luego actualizamos las imágenes
        for (const update of updates) {
            const result = await ProductModel.updateOne(
                { code: update.code },
                { $set: { thumbnails: update.images } }
            );
            console.log(`\nProducto ${update.code}:`);
            console.log(`- Encontrado: ${result.matchedCount > 0 ? 'Sí' : 'No'}`);
            console.log(`- Actualizado: ${result.modifiedCount > 0 ? 'Sí' : 'No'}`);
        }

        console.log('\nActualización completada');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateImages(); 