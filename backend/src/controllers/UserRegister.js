

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

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new APIerror(500,"something went wrong while registering the user")
    }

    return res.status(201).json(
        new APIresponse(200,createdUser,"User registered successfully")
    )
}


const generateAccessAndRefreshTokens = async (userId) => {
    try{

        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

    
        return {accessToken,refreshToken}

    }catch(error){
        throw new APIerror(500,"something went wrong while creating access and refresh tokens")
    }
}

const loginUser = async (req,res)=>{


    const {email , username , password} = req.body;

    if(!(username || email)){
        throw new APIerror(400,"username or email is required")
    }

    const user = await User.findOne({
        $or:[{email},{username}]
    })

    if(!user){
        throw new APIerror(404,"user does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new APIerror(401,"password not valid");
    }

    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id)

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options)
    .json(new APIresponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "User logged In successfully"
    ))
}

const logoutUser = async (req,res) => {
    await User.findByIdAndUpdate(req.user._id ,
        { $set: {
            refreshToken:undefined
        } 
    },
    {
        new:true
    }

)

const options = {
        httpOnly:true,
        secure:true
    }

    return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new APIresponse(200,{},"Usr logged out"))
}



export {userregister , generateAccessAndRefreshTokens , loginUser ,  logoutUser}
