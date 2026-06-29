// src/services/email.service.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendJobNotification = async (jobTitle, companyName, bccEmails) => {
    // If no one is eligible, don't send emails!
    if (!bccEmails || bccEmails.length === 0) return; 

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            bcc: bccEmails, // BCC protects students' privacy
            subject: `New Job Posting: ${jobTitle} at ${companyName}`,
            html: `
                <h2>A new job has been posted!</h2>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Role:</strong> ${jobTitle}</p>
                <p>Based on your profile, you are eligible to apply. Log in to the Campus Placement portal to submit your application before the deadline.</p>
                <br>
                <p>Best,<br>Placement Cell</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Emails sent successfully to", bccEmails.length, "students!");
    } catch (error) {
        console.error("Failed to send emails:", error);
    }
};

module.exports = { sendJobNotification };
