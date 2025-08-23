import mongoose from 'mongoose';
const schema = new mongoose.Schema({ name:{type:String,required:true}, parent:{type:mongoose.Schema.Types.ObjectId, ref:'Category', default:null} }, {timestamps:true});
export default mongoose.model('Category', schema);
