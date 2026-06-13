import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        toLowercase:true,
        trim:true
    },
    email:{
        type:String,
        require:true
        
    },
    password:{
        type:String,
        require:true
    },
    refresh_token:{
        type:String
    }

} , {timestamps:true})


UserSchema.pre("save" , async function(){
    if(!(this.isModified("password"))) return ;

    this.password = await bcrypt.hash(this.password , 10);
    
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password);
}

UserSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username
    } , 
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
UserSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        _id:this._id,
    } , 
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User" , UserSchema);