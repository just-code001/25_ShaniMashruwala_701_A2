import mongoose from 'mongoose';
const itemSchema = new mongoose.Schema({ product:{type:mongoose.Schema.Types.ObjectId, ref:'Product'}, qty:Number, price:Number }, {_id:false});
const schema = new mongoose.Schema({ customerName:String, customerEmail:String, items:[itemSchema], total:Number }, {timestamps:true});
export default mongoose.model('Order', schema);
