

import { User } from "../models/user.models.js";
import APIresponse from "../utils/APIresponse.js";
import APIerror from "../utils/APIerror.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
};

const userregister = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email?.trim() || !username?.trim() || !password?.trim()) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existedUser = await User.findOne({
            $or: [{ username: username.toLowerCase().trim() }, { email: email.toLowerCase().trim() }]
        });

        if (existedUser) {
            return res.status(409).json({ success: false, message: "User with username or email already exists" });
        }

        const user = await User.create({
            email: email.toLowerCase().trim(),
            password,
            username: username.toLowerCase().trim()
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            return res.status(500).json({ success: false, message: "Something went wrong while registering the user" });
        }

        return res.status(201).json(
            new APIresponse(201, createdUser, "User registered successfully")
        );
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new APIerror(500, "Something went wrong while creating access and refresh tokens");
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const loginIdentifier = (email || username || "").trim().toLowerCase();

        if (!loginIdentifier || !password) {
            return res.status(400).json({ success: false, message: "Username/email and password are required" });
        }

        const user = await User.findOne({
            $or: [{ email: loginIdentifier }, { username: loginIdentifier }]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        return res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(new APIresponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            ));
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: 1 } },
            { new: true }
        );

        return res
            .status(200)
            .clearCookie("accessToken", cookieOptions)
            .clearCookie("refreshToken", cookieOptions)
            .json(new APIresponse(200, {}, "User logged out"));
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({ success: false, message: "Refresh token required" });
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user || incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
                success: true,
                accessToken,
                refreshToken
            });
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
};

export {userregister , generateAccessAndRefreshTokens , loginUser ,  logoutUser , refreshAccessToken}
