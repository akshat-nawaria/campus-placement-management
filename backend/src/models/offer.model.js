const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
    studentId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "student",
        required : true
    },
    companyId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "company",
        required : true
    },
    jobId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Job",
        required : true
    },
    package :{
        type : String,
        required : true
    },
    status:{
        type : String,
        enum : ["Offered", "Accepted", "Rejected"],
        default : "Offered"
    }
}, { timestamps: true });

//to prevent duplicate offer for the same student and job
offerSchema.index({ studentId: 1, jobId : 1 }, { unique : true })

const offerModel = mongoose.model("Offer", offerSchema);

module.exports = offerModel;