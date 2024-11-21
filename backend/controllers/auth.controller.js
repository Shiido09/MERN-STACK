import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import { User } from "../models/user.model.js";
import { auth } from "../firebase.js"; // Import Firebase auth

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create user in Firebase
        const firebaseUser = await auth.createUser({
            email,
            password
        });

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            firebaseUid: firebaseUser.uid, // Store Firebase UID
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
        await user.save();

        // JWT
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, user.verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "Email not verified" });
        }

        // Verify user in Firebase
        const firebaseUser = await auth.getUserByEmail(email);
        if (!firebaseUser) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id);
        await user.save();

        res.status(200).json({
            success: true,
            message: user.isAdmin ? "Logged in successfully as admin" : "Logged in successfully as user",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            throw new Error("Invalid or expired verification code");
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // Send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.log("Error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        // Update password
        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Get all users
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json({
            success: true,
            count: users.length, // Count the fetched users
            users, // Return the list of users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        next(new ErrorHandler("Error fetching users", 500)); // Use the ErrorHandler
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select("-password"); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
