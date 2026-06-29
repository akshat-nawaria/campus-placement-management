const company = require("../models/company.model");


//function to add new company
const addCompany = async (req,res)=>{
    try{
        const {name, industry, description, website, hrContacts} = req.body;

        const existingCompany = await company.findOne({name});
        if(existingCompany){
            return res.status(400).json({
                message : "Company with this name already exists"
            })
        }

        const newCompany = await company.create({
            name,
            industry,
            description,
            website,
            hrContacts
        });

        res.status(200).json({
            message: "Company added successfully",
            newCompany
        })
    }
    catch(err){
        console.log("Add Company error:", err)
        return res.status(500).json({
            message: "Failed to add company",
            error : err.message
        });
    }
}


//get all active companies
const getAllCompanies = async (req,res)=>{
    try{
        const companies = await company.find({isActive : true})

        return res.status(200).json({companies})
    }
    catch(error){
        console.error("Get Companies Error:", error);
        res.status(500).json({ message: "Failed to fetch companies", error: error.message });
    }
}


module.exports = {
    addCompany,
    getAllCompanies
}