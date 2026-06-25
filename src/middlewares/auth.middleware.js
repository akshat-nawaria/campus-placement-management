const jwt = require("jwt");

// function to check if the user is logged in
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({
            message: "Access Denied"
        })
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;

        next();
    }
    catch (err) {
        return res.status(403).json({
            message: "Invalid or Expired token"
        })
    }
}

//middleware to check whether the user has correct role or not
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // req.user is set by the requireAuth middleware above
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                message: "User not authenticated properly"
            })
        }

        // Check if the user's role is inside the array of allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden. you do not have permission to perform this action"
            })
        }

        next();
    }
}

module.exports = {
    requireAuth,
    requireRole
};