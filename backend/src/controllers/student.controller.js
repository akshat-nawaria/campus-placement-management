const studentModel = require("../models/student.model")

//create or update student profile
const createOrUpdateProfile = async (req,res)=>{

    try{
        //req.user is set by the rrquireAuthmiddleware
        const userId = req.user.id;
        const {rollNo, branch, passingYear, cgpa, backlogCount} = req.body;

        let resumeUrl = req.file ? '/uploads/' + req.file.filename : undefined;

        let student = await studentModel.findOne({ userId });

        if(student){
            //update existing profile
            student.rollNo = rollNo || student.rollNo;
            student.branch = branch || student.branch;
            student.passingYear = passingYear || student.passingYear;
            student.cgpa = cgpa || student.cgpa;
            if (backlogCount !== undefined) student.backlogCount = backlogCount;
            if (resumeUrl) student.resumeUrl = resumeUrl;

            // Reset verification status so TPO checks again after an update
            student.isVerifiedByTPO = false

            await student.save();
            return res.status(200).json({
                message:"Profile updated successfully",
                student
            })
        }
        else{
            const student = await studentModel.create({
                userId, rollNo, branch, passingYear, cgpa, backlogCount: backlogCount || 0, resumeUrl
            })

            return res.status(201).json({message:"Profile created successfully", student});
        }
    }
    catch(error){
        console.log("Profile error", error);
        res.status(500).json({ message: "Failed to save profile", error: error.message });
    }
}

//function to get the profile
const getProfile = async (req,res)=>{
    try{
        const userId = req.user.id;
        // Populate grabs the linked User data (name, email)
        const student = await studentModel.findOne({userId}).populate("userId", "name email")

        if(!student){
            return res.status(400).json({
                message:"Student profile not found"
            })
        }
        res.status(200).json({student})
    }
    catch(err){
        return res.status(500).json({
            message:"Failed to fetch profile",
            err : err.message
        });
    }
}


// GET all students (for TPO dashboard)
const getAllStudents = async (req, res) => {
    try {
        const students = await studentModel.find().populate("userId", "name email");
        res.status(200).json({ students });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch students", error: error.message });
    }
};

//TPO verification end point
const verifyProfile = async (req, res) => {
    try {
        const { studentId } = req.params; // This is the _id of the Student document
        
        const student = await studentModel.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        student.isVerifiedByTPO = true;
        await student.save();
        res.status(200).json({ message: "Student verified successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Verification failed", error: error.message });
    }
};

module.exports = {
    verifyProfile,
    getProfile,
    createOrUpdateProfile,
    getAllStudents
};