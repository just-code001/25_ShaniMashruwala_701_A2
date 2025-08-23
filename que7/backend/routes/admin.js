import express from 'express';
import Admin from '../models/Admin.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
const router = express.Router();

function isAuth(req,res,next){ if(req.session && req.session.adminId) return next(); res.redirect('/admin/login'); }

// Admin login pages
router.get('/admin/login', (req,res)=>{ res.render('admin/login',{ message: req.flash('error') }); });
router.post('/admin/login', async (req,res)=>{
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if(!admin) { req.flash('error','Invalid credentials'); return res.redirect('/admin/login'); }
  const ok = await admin.compare(password);
  if(!ok){ req.flash('error','Invalid credentials'); return res.redirect('/admin/login'); }
  req.session.adminId = admin._id; res.redirect('/admin');
});

router.post('/admin/logout', (req,res)=>{ req.session.destroy(()=>res.redirect('/admin/login')); });

router.get('/admin', isAuth, async (req,res)=>{
  const counts = { categories: await Category.countDocuments(), products: await Product.countDocuments(), orders: await Order.countDocuments() };
  res.render('admin/dashboard',{ counts });
});

// Categories CRUD
router.get('/admin/categories', isAuth, async (req,res)=>{
  const cats = await Category.find().populate('parent').lean();
  res.render('admin/categories',{ cats });
});
router.post('/admin/categories', isAuth, async (req,res)=>{
  const { name, parent } = req.body;
  await Category.create({ name, parent: parent || null });
  res.redirect('/admin/categories');
});
router.post('/admin/categories/delete/:id', isAuth, async (req,res)=>{
  await Category.findByIdAndDelete(req.params.id); res.redirect('/admin/categories');
});

// Products CRUD
router.get('/admin/products', isAuth, async (req,res)=>{
  const products = await Product.find().populate('category').lean();
  const cats = await Category.find().lean();
  res.render('admin/products',{ products, cats });
});
router.get('/admin/products/new', isAuth, async (req,res)=>{ const cats = await Category.find().lean(); res.render('admin/product_form',{ product:null, cats }); });
router.post('/admin/products', isAuth, async (req,res)=>{
  const { title, description, price, category, image, stock } = req.body;
  await Product.create({ title, description, price, category: category || null, image, stock: stock||0 });
  res.redirect('/admin/products');
});
router.get('/admin/products/edit/:id', isAuth, async (req,res)=>{ const product = await Product.findById(req.params.id).lean(); const cats = await Category.find().lean(); res.render('admin/product_form',{ product, cats }); });
router.post('/admin/products/edit/:id', isAuth, async (req,res)=>{
  const { title, description, price, category, image, stock } = req.body;
  await Product.findByIdAndUpdate(req.params.id,{ title, description, price, category: category||null, image, stock: stock||0 });
  res.redirect('/admin/products');
});
router.post('/admin/products/delete/:id', isAuth, async (req,res)=>{ await Product.findByIdAndDelete(req.params.id); res.redirect('/admin/products'); });

// Orders list
router.get('/admin/orders', isAuth, async (req,res)=>{
  const orders = await Order.find().populate('items.product').sort({createdAt:-1}).lean();
  res.render('admin/orders',{ orders });
});

export default router;
