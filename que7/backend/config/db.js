import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopping_cart_db';
export async function connectDB(){ try{ await mongoose.connect(uri); console.log('MongoDB connected'); }catch(e){ console.error('DB err', e); process.exit(1);} }
