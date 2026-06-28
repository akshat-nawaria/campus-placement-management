const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    studentId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "student",
        required : true
    },
    jobId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Job",
        required : true
    },
    status:{
        type : String,
        enum : ["Applied", "Online Assessment", "Technical Interview", "HR Interview", "Selected", "Rejected"],
        default : "Applied"
    },
}, {timestamps:true})

//this ensures that a student does not applies for a job twice
applicationSchema.index({studentId : 1, jobId: 1}, {unique : true});

const applicationModel = mongoose.model("Application", applicationSchema);
module.exports = applicationModel;