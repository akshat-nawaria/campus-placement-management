const mongoose = require("mongoose");
const ROLES = require("../utils/constants");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type : String,
        required: true,
        unique : true
    },
    password :{
        type : String,
        required: true
    },
    role:{
        type: String,
        required: true,
        enum : Object.values(ROLES)
    },
    googleId:{
        type: String
    },
    isVerified:{
        type:Boolean,
        default : false
    }
}, {timestamps : true})


const userModel = mongoose.model("user", userSchema)

module.exports = userModel