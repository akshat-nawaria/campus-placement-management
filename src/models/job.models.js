const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    companyId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "company",
        required : true
    },
    jobType:{
        type : String,
        enum : ["Full-Time", "Internship"],
        required: true
    },
    description:{
        type : String
    },
    salary:{
        type : String
    },
    eligibilityCriteria:{
        minCgpa:{
            type : Number,
            default : 0
        },
        allowedBranches:{
            type : [String]
        },
        allowBacklogs:{
            type : Boolean,
            default : false
        },
        targetBatchYear:{
            type : Number,
            required : true
        }
    },
    applicationDeadline:{
        type : Date,
        required: true
    },
    status:{
        type: String,
        enum : ["Open", "Closed"],
        default : "Open"
    },
    overriddenStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "student"
    }]
}, { timestamps:true })

const jobModel = mongoose.model("Job", jobSchema);

module.exports = jobModel;