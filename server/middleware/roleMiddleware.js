// This middleware takes a list of allowed roles as arguments
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // 'req.user' was attached by the 'protect' middleware which runs before this.
        if (!req.user || !roles.includes(req.user.role)) {
            // If the user's role is not in the list of allowed roles, block them.
            return res.status(403).json({ 
                message: `User role '${req.user.role}' is not authorized to access this route` 
            });
        }
        // If the user's role is allowed, let them pass.
        next();
    };
};