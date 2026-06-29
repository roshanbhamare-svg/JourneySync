

import { User } from "../models/user.models.js";
import APIresponse from "../utils/APIresponse.js"
import APIerror from "../utils/APIerror.js";


const userregister= async (req,res) => {

    try {
        const {email , username , password} = req.body
        console.log("email ",email);

        if(
            [email,username,password].some((feild) => feild?.trim() === "")
        ){
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existedUser = await User.findOne({
            $or:[{username},{email}]
        })

        if(existedUser){
            return res.status(409).json({ success: false, message: "User with username or email already exists" });
        }

        const user = await User.create({
            email,
            password,
            username:username.toLowerCase()
        })

        const createdUser = await User.findById(user._id).select("-password -refreshToken")

        if(!createdUser){
            return res.status(500).json({ success: false, message: "Something went wrong while registering the user" });
        }

        return res.status(201).json(
            new APIresponse(200, createdUser, "User registered successfully")
        )
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message });
    }
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

    try {
        const {email , username , password} = req.body;

        if(!(username || email)){
            return res.status(400).json({ success: false, message: "username or email is required" });
        }

        const user = await User.findOne({
            $or:[{email},{username}]
        })

        if(!user){
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if(!isPasswordValid){
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id)

        const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        }

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new APIresponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In successfully"
            ))
    } catch(error) {
        return res.status(500).json({ success: false, message: error.message });
    }
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



const refreshAccessToken = async (req,res)=>{

    const incomingRefreshToken =

        req.cookies.refreshToken ||

        req.body.refreshToken;

    if(!incomingRefreshToken){

        throw new APIerror(
            401,
            "Refresh token required"
        );

    }

    try{

        const decodedToken =
        jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user =
        await User.findById(
            decodedToken?._id
        );

        if(!user){

            throw new APIerror(
                401,
                "Invalid refresh token"
            );

        }

        if(
            incomingRefreshToken !==
            user.refreshToken
        ){

            throw new APIerror(
                401,
                "Refresh token expired"
            );

        }

        const {

            accessToken,

            refreshToken

        }

        = await generateAccessAndRefreshTokens(
            user._id
        );

        const options = {

            httpOnly:true,

            secure:true

        };

        return res

        .status(200)

        .cookie(
            "accessToken",
            accessToken,
            options
        )

        .cookie(
            "refreshToken",
            refreshToken,
            options
        )

        .json({

            success:true,

            accessToken,

            refreshToken

        });

    }
    catch(error){

        throw new APIerror(
            401,
            "Invalid refresh token"
        );

    }

};

export {userregister , generateAccessAndRefreshTokens , loginUser ,  logoutUser , refreshAccessToken}
