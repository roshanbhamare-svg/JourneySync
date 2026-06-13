

import { User } from "../models/user.models.js";
import APIresponse from "../utils/APIresponse.js"
import APIerror from "../utils/APIerror.js";

const userregister= async (req,res) => {

    const {email , username , password} = req.body
    console.log("email ",email);

    if(
        [email,username,password].some((feild) => feild?.trim() === "")
    ){
        throw new APIerror(400,"all feilds are required")
    }

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new APIerror(409,"user with username or email already exists")
    }

    const user = await User.create({
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refeshToken")

    if(!createdUser){
        throw new APIerror(500,"something went wrong while registering the user")
    }

    return res.status(201).json(
        new APIresponse(200,createdUser,"User registered successfully")
    )
}


export {userregister}
