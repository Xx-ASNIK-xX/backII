import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from '../src/models/user.model.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

async function removeAdmin() {
  try {
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB');
    const result = await UserModel.deleteOne({ email: 'adminCoder@coder.com' });
    console.log('Resultado de deleteOne:', result);
  } catch (err) {
    console.error('Error eliminando admin:', err);
  } finally {
    mongoose.disconnect();
  }
}

removeAdmin(); 