import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
const router = express.Router();

// list categories (two-level)
router.get('/categories', async (req,res)=>{
  const parents = await Category.find({ parent: null }).lean();
  const all = await Category.find().lean();
  // attach children
  const map = {};
  all.forEach(c=>{ map[c._id]=c; c.children=[]; });
  all.forEach(c=>{ if(c.parent){ map[c.parent]?.children.push(c); } });
  res.json(parents);
});

// products list - optional category filter
router.get('/products', async (req,res)=>{
  const { category } = req.query;
  const q = category ? { category } : {};
  const products = await Product.find(q).populate('category').lean();
  res.json(products);
});

router.get('/products/:id', async (req,res)=>{
  const p = await Product.findById(req.params.id).populate('category').lean();
  if(!p) return res.status(404).json({message:'Not found'});
  res.json(p);
});

// create order
router.post('/orders', async (req,res)=>{
  try{
    const { customerName, customerEmail, items } = req.body;
    if(!items || !Array.isArray(items) || items.length===0) return res.status(400).json({message:'No items'});
    let total = 0;
    const lineItems = [];
    for(const it of items){
      const prod = await Product.findById(it.id);
      if(!prod) continue;
      lineItems.push({ product: prod._id, qty: it.qty, price: prod.price });
      total += prod.price * Number(it.qty);
    }
    const order = await Order.create({ customerName, customerEmail, items: lineItems, total });
    res.status(201).json({ orderId: order._id, total });
  }catch(e){ console.error(e); res.status(500).json({message:'Failed'}); }
});

export default router;
