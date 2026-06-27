
const isEligible = (student, job)=>{

    // If the TPO manually allowed this student, skip all other checks!
    if (job.overriddenStudents && job.overriddenStudents.includes(student._id.toString())) {
        return true;
    }

    if(student.passingYear !== job.eligibilityCriteria.targetBatchYear){
        return false;
    }
    if(student.cgpa < job.eligibilityCriteria.minCgpa){
        return false;
    }

    if(!job.eligibilityCriteria.allowedBranches.includes(student.branch)){
        return false;
    }

    if(!job.eligibilityCriteria.allowBacklogs && student.backlogCount > 0){
        return false;
    }

    if(!student.isVerifiedByTPO){
        return false;
    }

    return true;
}

module.exports = {
    isEligible
}