const job = require("../models/job.models");
const student = require("../models/student.model");
const {isEligible} = require("../utils/eligibility")
const {sendJobNotification} = require("../services/email.service")
const Company = require("../models/company.model");

//function to create a new job posting
const createJob = async (req,res)=>{
    try{
        const newJob = await job.create(req.body)
        
        //TRIGGER EMAIL NOTIFICATION IN BACKGROUND
        const companyData = await Company.findById(newJob.companyId);
        const allStudents = await student.find({isVerifiedByTPO:true}).populate("userId", "email");
        const eligibleStudents = allStudents.filter(student => isEligible(student, newJob));

        const bccEmails = eligibleStudents.map(student => student.userId.email);

        if(companyData){
            sendJobNotification(newJob.title, companyData.name, bccEmails);
        }

        return res.status(201).json({
            message:"Job posted successfully",
            job : newJob
        })
    }
    catch(err){
        console.log("Create Job Error", err);
        return res.status(500).json({
            message : "Failed to post Job",
            error : err.message
        })
    }
}


//function to get all open jobs
const getAllJobs = async (req,res)=>{
    try{
        const jobs = await job.find({status : "Open"}).populate("companyId", "name industry website");
        return res.status(200).json({jobs});
    }
    catch(error){
        console.error("Get Jobs Error:", error);
        res.status(500).json({ message: "Failed to fetch jobs", error: error.message });
    }
}

const getEligibleStudents = async (req,res)=>{
    try{
        const {jobId} = req.params;

        const jobData = await job.findById(jobId);

        if(!jobData){
            return res.status(404).json({
                message : "Job not found"
            })
        }

        const allStudents = await student.find({isVerifiedByTPO : true}).populate("userId", "name email");

        const eligibleStudents = allStudents.filter(student => isEligible(student, jobData));
        res.status(200).json({
                message: "Eligibility check complete",
                jobTitle: jobData.title,
                totalEligible: eligibleStudents.length,
                students: eligibleStudents
            });
        }
        catch(err){
            console.log("Eligibility criteria error", err);
            return res.status(500).json({
                message :"Failed to run eligibility engine",
                error : err.message
            })
        }
}

//manually override eligibility for a student
const overrideEligibility = async (req,res)=>{
    try{
        const {jobId} = req.params;
        const {studentId} = req.body

        const jobData = await job.findById(jobId)
        if(!jobData){
            return res.status(404).json({
                message: "Job Not  Found"
            })
        }

        if(!jobData.overriddenStudents.includes(studentId)){
            jobData.overriddenStudents.push(studentId);
            await jobData.save();
        }

        res.status(200).json({ message: "Student manually approved for this job!" });
    }
    catch(error){
        res.status(500).json({ message: "Override failed", error: error.message });
    }
}

module.exports = {
    createJob,
    getAllJobs,
    getEligibleStudents,
    overrideEligibility
}