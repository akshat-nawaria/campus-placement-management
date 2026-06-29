const Student = require("../models/student.model");
const Offer = require("../models/offer.model");
const Job = require("../models/job.models");
const Company = require("../models/company.model")

const getDashboardStats = async (req,res)=>{
    try{
        const totalStudents = await Student.countDocuments({isVerifiedByTPO : true});
        const placedStudents = await Student.countDocuments({hasAcceptedOffer : true});

        const placementPercentage = totalStudents === 0 ? 0 : ((placedStudents/totalStudents)*100).toFixed(2);

        const totalJobs = await Job.countDocuments();
        const totalCompanies = await Company.countDocuments();


        //branch wise aggregation (using mongoose aggregation)
        const branchStats = await Student.aggregate([
            { $match: {isVerifiedByTPO : true}},
            {
                $group:{
                    _id : "$branch", //group by branch
                    totalStudents : { $sum: 1 },
                    placedStudents: { $sum: { $cond: ["$hasAcceptedOffer", 1, 0] } } // Count placed in branch
                }
            },
            {
                $project: {
                    branch: "$_id",
                    totalStudents: 1,
                    placedStudents: 1,
                    percentage: {
                        $round: [
                            { $multiply: [ { $divide: ["$placedStudents", "$totalStudents"] }, 100 ] },
                            2
                        ]
                    },
                    _id: 0
                }
            }
        ]);

        return res.status(200).json({
            message : "Dashboard Statistics",
            overall:{
                totalStudents,
                placedStudents,
                placementPercentage : `${placementPercentage}%`,
                totalJobs,
                totalCompanies
            },
            branchWise : branchStats
        })
    }
    catch(error){
        res.status(500).json({ message: "Failed to generate analytics", error: error.message });
    }
}


module.exports = {
    getDashboardStats
}