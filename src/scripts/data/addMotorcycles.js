import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductModel from '../models/product.model.js';

dotenv.config();

const motorcycles = [
    {
        title: "Honda CBR1000RR-R Fireblade",
        description: "Superbike de alto rendimiento con 217 CV y tecnología derivada de MotoGP",
        code: "HCBR1000",
        price: 45000000,
        stock: 5,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Yamaha YZF-R1M",
        description: "Moto deportiva con electrónica avanzada y componentes de competición",
        code: "YYZF-R1M",
        price: 42000000,
        stock: 3,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Ducati Panigale V4 S",
        description: "La máxima expresión de la tecnología deportiva italiana",
        code: "DPV4S",
        price: 48000000,
        stock: 4,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Kawasaki Ninja ZX-10R",
        description: "Campeona del Mundial de Superbikes con tecnología de pista",
        code: "KNZ10R",
        price: 39000000,
        stock: 6,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "BMW S1000RR",
        description: "Precisión alemana con 207 CV y paquete M",
        code: "BS1000RR",
        price: 43000000,
        stock: 4,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Aprilia RSV4 Factory",
        description: "Tecnología italiana de competición para la calle",
        code: "ARSV4F",
        price: 44000000,
        stock: 3,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Suzuki GSX-R1000R",
        description: "La evolución del icónico GSX-R con electrónica moderna",
        code: "SGSX1000R",
        price: 38000000,
        stock: 5,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "MV Agusta F4 RC",
        description: "Arte italiano sobre dos ruedas con prestaciones extremas",
        code: "MVF4RC",
        price: 52000000,
        stock: 2,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "KTM RC 8C",
        description: "Edición limitada lista para circuito",
        code: "KRC8C",
        price: 46000000,
        stock: 3,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Triumph Speed Triple 1200 RS",
        description: "Naked deportiva británica con motor de tres cilindros",
        code: "TST1200RS",
        price: 37000000,
        stock: 4,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Ducati Streetfighter V4 S",
        description: "La hipernaked italiana con ADN de Panigale",
        code: "DSFV4S",
        price: 41000000,
        stock: 5,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "BMW M1000RR",
        description: "Primera moto M de BMW con aerodinámica avanzada",
        code: "BM1000RR",
        price: 49000000,
        stock: 3,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Yamaha MT-10 SP",
        description: "La naked más potente de Yamaha con suspensión electrónica",
        code: "YMT10SP",
        price: 36000000,
        stock: 6,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Honda CB1000R Black Edition",
        description: "Estilo neo-retro con prestaciones modernas",
        code: "HCB1000R",
        price: 35000000,
        stock: 4,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Kawasaki Z H2 SE",
        description: "Naked supercharged con 200 CV",
        code: "KZH2SE",
        price: 40000000,
        stock: 4,
        category: "motos",
        thumbnails: [
           "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Aprilia Tuono V4 Factory",
        description: "La naked derivada de la RSV4",
        code: "ATV4F",
        price: 38000000,
        stock: 5,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"         
        ]
    },
    {
        title: "MV Agusta Brutale 1000 RR",
        description: "La naked más potente del mercado",
        code: "MVB1000RR",
        price: 45000000,
        stock: 3,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Ducati Monster SP",
        description: "La nueva generación del icónico Monster",
        code: "DMSP",
        price: 34000000,
        stock: 6,
        category: "motos",
        thumbnails: [
           "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "KTM 1290 Super Duke R Evo",
        description: "La bestia austriaca con suspensión semi-activa",
        code: "KSDR1290E",
        price: 39000000,
        stock: 4,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    },
    {
        title: "Suzuki Hayabusa",
        description: "La leyenda de la velocidad renovada",
        code: "SHAY2023",
        price: 42000000,
        stock: 3,
        category: "motos",
        thumbnails: [
            "img1.jpg", "img2.jpg"
        ]
    }
];

const addMotorcycles = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        for (const moto of motorcycles) {
            try {
                await ProductModel.create(moto);
                console.log(`Moto agregada: ${moto.title}`);
            } catch (error) {
                if (error.code === 11000) {
                    console.log(`La moto ${moto.title} ya existe (código duplicado)`);
                } else {
                    console.error(`Error al agregar ${moto.title}:`, error.message);
                }
            }
        }

        console.log('Proceso completado');
        process.exit(0);
    } catch (error) {
        console.error('Error de conexión:', error);
        process.exit(1);
    }
};

addMotorcycles(); 