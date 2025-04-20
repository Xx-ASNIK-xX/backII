import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
    try {
        console.log('Intentando conectar a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('¡Conexión exitosa!');
        
        // Probar que podemos hacer operaciones
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Colecciones en la base de datos:', collections.map(c => c.name));
        
        await mongoose.connection.close();
        console.log('Conexión cerrada correctamente');
    } catch (error) {
        console.error('Error de conexión:', error.message);
    } finally {
        process.exit(0);
    }
}

testConnection(); 