const Application = require("../models/application.model");
const Job = require("../models/job.models");
const Student = require("../models/student.model");
const { isEligible } = require("../utils/eligibility");

const applyForJob = async (req,res)=>{
    try{
        const {jobId} = req.params;
        const userId = req.user.id; 

        //find the student profile linked to the logged-in user
        const studentProfile = await Student.findOne({userId});
        if(!studentProfile){
            return res.status(404).json({
                message : "Profile not found, please complete your profile first"
            })
        }

        //ensure that the job exists and is still open
        const job = await Job.findById(jobId); 
        if(!job || job.status !== "Open"){
            return res.status(404).json({
                message : "Job not found or is no longer accepting application"
            })
        }

        //student eligibility check
        if(!isEligible(studentProfile, job)){
            return res.status(403).json({
                message : "You do not meet the eligibility criteria for this job"
            })
        }

        const newApplication = await Application.create({ 
            studentId : studentProfile._id,
            jobId : job._id, 
            coverLetter : req.body.coverLetter || ""
        });

        return res.status(201).json({
            message : "Successfully applied for the job",
            application : newApplication
        });
    }
    catch(error){
        if(error.code === 11000){
            return res.status(400).json({
                message : "You have already applied for this job"
            })
        }
        return res.status(500).json({
            message : "Application failed",
            error : error.message
        })
    }
}

//view all applications for a specific job (for TPO)
const getApplicationsForJob = async (req,res)=>{
    try{
        const {jobId} = req.params;
        const applications = await Application.find({jobId}) 
        .populate({
            path : "studentId",
            populate : {path : "userId", select : "name email"}
        });

        return res.status(200).json({ applications })
    }
    catch(error){
        return res.status(500).json({
            message : "Failed to fetch applications",
            error : error.message
        })
    }
}

//update the status of a specific application
const updateApplicationStatus = async (req,res)=>{
    try{
        const {applicationId} = req.params;
        const { status } = req.body; 

        const validStatuses = [
            "Applied", "Online Assessment", "Technical Interview", 
            "HR Interview", "Selected", "Rejected"
        ];

        if(!validStatuses.includes(status)){
            return res.status(400).json({
                message : "Invalid status provided"
            })
        }

        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status },
            {new : true}
        );

        if(!application){
            return res.status(404).json({
                message : "Application not found"
            })
        }

        return res.status(200).json({
            message : `Application status updated to ${status}`,
            application
        })
    }
    catch(error){
        return res.status(500).json({ message: "Failed to update status", error: error.message });
    }
}

// Bulk update statuses using an array of Roll Numbers
const bulkUpdateStatus = async (req,res)=>{
    try{
        const {jobId} = req.params; 
        const {rollNumbers, status} = req.body; 
        
        const validStatuses = ["Applied", "Online Assessment", "Technical Interview", "HR Interview", "Selected", "Rejected"];

        if(!validStatuses.includes(status)){
            return res.status(400).json({
                message : "Invalid status provided"
            })
        }

        const students = await Student.find({rollNo : {$in : rollNumbers }});
        const studentIds = students.map(s => s._id)

        if(studentIds.length === 0){
            return res.status(400).json({
                message : "No matching student found"
            })
        }

        const result = await Application.updateMany(
            {
                jobId : jobId,
                studentId : {$in : studentIds}
            },
            { status : status}
        );

        return res.status(200).json({
            message : `Successfully updated ${result.modifiedCount} applications to ${status}`,
            matchedStudents: students.length
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Bulk update failed",
            error : error.message
        })
    }
}

module.exports = {
    applyForJob,
    getApplicationsForJob,
    updateApplicationStatus,
    bulkUpdateStatus
}
