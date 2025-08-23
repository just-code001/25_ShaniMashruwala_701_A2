import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title:{type:String,required:true},
  description:{type:String,default:''},
  price:{type:Number,required:true},
  category:{type:mongoose.Schema.Types.ObjectId, ref:'Category'},
  image:{type:String,default:''},
  stock:{type:Number,default:100}
},{timestamps:true});
export default mongoose.model('Product', schema);
