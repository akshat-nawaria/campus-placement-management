const Offer = require("../models/offer.model");
const Student = require("../models/student.model");


//TPO issues an offer to the student
const issueOffer = async (req,res)=>{
    try{
        const {studentId, companyId, jobId, package: packageOffered} = req.body;

        const newOffer = await Offer.create({
            studentId,
            companyId,
            jobId,
            package: packageOffered
        });
        return res.status(201).json({
            message : "Offer has been issued",
            offer : newOffer
        })
    }
    catch(error){
        if(error.code === 11000){
            return res.status(400).json({
                message : "This student already has an offer for this job"
            })
        }

        return res.status(500).json({
            message : "Failed to issue offer",
            error : error.message
        })
    }
}


const acceptOffer = async (req,res)=>{
    try{
        const { offerId } = req.params;
        const userId = req.user.id;

        const studentProfile = await Student.findOne({ userId });
        const offer = await Offer.findById(offerId);

        if(!offer){
            return res.status(404).json({
                message :"Offer Not Found"
            })
        }

        //ensure that the offer actually belong to the logged-in student
        if(offer.studentId.toString() !== studentProfile._id.toString()){
            return res.status(403).json({
                message : "You can only accept your own offer."
            })
        }

        offer.status = "Accepted";
        await offer.save();

        studentProfile.hasAcceptedOffer = true;
        await studentProfile.save();

        res.status(200).json({
            message: "Congratulations! You accepted the offer. The Single-Offer Policy is now active, blocking future applications.",
            offer
        });
    }
    catch(error){
        res.status(500).json({ message: "Failed to accept offer", error: error.message });
    }
}

// Student views their own offer
const getMyOffer = async (req, res) => {
    try {
        const userId = req.user.id;
        const studentProfile = await Student.findOne({ userId });
        if (!studentProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        const offer = await Offer.findOne({ studentId: studentProfile._id })
            .populate("companyId", "name")
            .populate("jobId", "title");
        if (!offer) {
            return res.status(404).json({ message: "No offer found" });
        }
        return res.status(200).json({ offer });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch offer", error: error.message });
    }
};

// TPO views all offers
const getAllOffers = async (req, res) => {
    try {
        const offers = await Offer.find()
            .populate({ path: "studentId", populate: { path: "userId", select: "name email" } })
            .populate("companyId", "name")
            .populate("jobId", "title")
            .sort({ createdAt: -1 });
        return res.status(200).json({ offers });
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch offers", error: error.message });
    }
};

module.exports = {
    issueOffer,
    acceptOffer,
    getMyOffer,
    getAllOffers
}