import mongoose from "mongoose";

const Userschema = new mongoose.Schema(
    {
    name:String,
    email: { type: String, unique: true },
    image:String,
    provider:String,
   },
   {timestamps:true}
)

export default mongoose.models.User || mongoose.model("User",Userschema)