const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required:true
    },
    rollNo:{
        type:String,
        required : true,
        unique : true
    },
    branch:{
        type : String,
        required: true
    },
    passingYear :{
        type: Number,
        required : true
    },
    backlogCount:{
        type : Number,
        default : 0
    },
    resumeUrl:{
        type : String
    },
    cgpa:{
        type : Number,
        required : true
    },
    isVerifiedByTPO:{
        type : Boolean,
        default : false
    }
}, {timestamps: true})

const studentModel = mongoose.model("student", studentSchema);

module.exports = studentModel;