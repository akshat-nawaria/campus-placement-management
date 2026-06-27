require('dotenv').config();
const jwt = require('jsonwebtoken');

// Change the role to "TPO" or "ADMIN" if you want to test those endpoints later!
const testUser = {
    id: "64a7c9f8e4b01a2b3c4d5e6f", // Dummy MongoDB ObjectId
    role: "TPO" // Must match your ROLES.STUDENT constant
};

const token = jwt.sign(testUser, process.env.JWT_SECRET, { expiresIn: '1d' });

console.log("Your Test Token (Copy everything below):");
console.log("Bearer " + token);
