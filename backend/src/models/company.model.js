const mongoose = require("mongoose");

const hrContactSchema = new mongoose.Schema({
    name:{
        type : String,
        required: true
    },
    email:{
        type : String,
        required : true
    },
    phone:{
        type : Number
    }
});

const companySchema = new mongoose.Schema({
    name:{
        type : String,
        required: true,
        unique : true
    },
    industry :{
        type : String
    },
    description:{
        type : String
    },
    website:{
        type : String
    },
    hrContacts : [hrContactSchema],
    isActive:{
        type : Boolean,
        default : true
    }
}, { timestamps: true })


const companyModel = mongoose.model("company", companySchema);

module.exports = companyModel;