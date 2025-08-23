import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const schema = new mongoose.Schema({ username:{type:String,unique:true,required:true}, password:{type:String,required:true} }, {timestamps:true});
schema.pre('save', async function(next){ if(!this.isModified('password')) return next(); this.password = await bcrypt.hash(this.password, 10); next(); });
schema.methods.compare = function(p){ return bcrypt.compare(p, this.password); };
export default mongoose.model('Admin', schema);
