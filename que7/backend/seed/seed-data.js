import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { connectDB } from '../config/db.js';
import Admin from '../models/Admin.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();
async function run(){
  await connectDB();
  await Admin.deleteMany({}); await Category.deleteMany({}); await Product.deleteMany({});
  const admin = new Admin({ username:'admin', password:'admin123' }); await admin.save();
  // create categories: Electronics -> Phones, Laptops ; Clothing -> Men, Women
  const electronics = await Category.create({ name:'Electronics' });
  const phones = await Category.create({ name:'Phones', parent: electronics._id });
  const laptops = await Category.create({ name:'Laptops', parent: electronics._id });
  const clothing = await Category.create({ name:'Clothing' });
  const men = await Category.create({ name:'Men', parent: clothing._id });
  const women = await Category.create({ name:'Women', parent: clothing._id });
  // products
  await Product.create({ title:'iPhone 14', description:'Apple phone', price:69900, category:phones._id, image:'', stock:50 });
  await Product.create({ title:'Dell Inspiron', description:'Laptop', price:45000, category:laptops._id, image:'', stock:20 });
  await Product.create({ title:'Men T-Shirt', description:'Cotton tee', price:499, category:men._id, image:'', stock:100 });
  console.log('Seeded admin: admin / admin123 and sample categories/products');
  await mongoose.disconnect();
}
run().catch(e=>{ console.error(e); process.exit(1); });