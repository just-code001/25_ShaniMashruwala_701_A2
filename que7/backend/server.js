import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import adminRoutes from './routes/admin.js';
import apiRoutes from './routes/api.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();

app.set('view engine','ejs');
app.set('views', path.join(__dirname, '../admin_views'));

app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET || 'secret', resave:false, saveUninitialized:false }));
app.use(flash());
app.use('/public', express.static(path.join(__dirname, '../public')));

app.use(adminRoutes);
app.use('/api', apiRoutes);

// serve user site static pages
app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'../public/index.html')));
app.get('/shop', (req,res)=> res.sendFile(path.join(__dirname,'../public/shop.html')));
app.get('/cart', (req,res)=> res.sendFile(path.join(__dirname,'../public/cart.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on http://localhost:'+PORT));
