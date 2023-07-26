const ErrorHandler = require("../utils/errorhandler");  
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken"); 
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors( async(req, res, next) => {

    const { token } = req.cookies;

    if(!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id); // jb tak login rhega user tbtk request me se user ka data access kr skte hn

    next();
}) 

exports.authorizeRoles = (...roles) => { // now roles becomes an array by applying ...
    return (req, res, next) => {

        if(!roles.includes(req.user.role)) { // if req.user.role is not admin, then this condition will execute
            return next(
                new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403)
            );
        }

        next(); 

    }
}