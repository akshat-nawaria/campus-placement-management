const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const ROLES = require("../utils/constants");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
    try {
        const { tokenId } = req.body;
        if (!tokenId) {
            return res.status(400).json({
                message: "Google Token ID is required"
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        // Extracted email, name, and sub (Google ID) without the picture
        const { email, name, sub } = ticket.getPayload();

        let user = await userModel.findOne({ email });

        if (!user) {
            //If they don't exist, register them automatically
            user = await userModel.create({
                name,
                email,
                googleId: sub,
                role: ROLES.STUDENT // Default role
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: "Authentication failed", error: error.message });
    }
};

module.exports = {
    googleLogin
};
