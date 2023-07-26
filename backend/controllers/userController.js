const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");


// Register a User
exports.registerUser = catchAsyncErrors( async(req, res, next) => {

    console.log(req.body.avatar);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars", // kis folder me upload krni h
        width: 150,
        crop: "scale",
    })

    console.log(myCloud.public_id);
    console.log(myCloud.secure_url);

    const {name, email, password} = req.body;

    const user = await User.create({
        name, 
        email, 
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        },
    });

    sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors( async (req, res, next) => {
    const {email, password} = req.body;
    
    // checking if user has given password and email both
    if(!email || !password) {
        return next(new ErrorHandler("Please Enter Email and Password", 400 /*Bad Request*/ ));
    }

    // finding user in database if both email and password found
    const user = await User.findOne({email: email}).select("+password"); // we don't used password directly as password has select property false in userModel

    if(!user) { // if user not found
        return next(new ErrorHandler("Invalid Email or Password", 401 /* Unauthorised*/ ));
    }

    // we have made comparePassword function in userModel.js
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401 /* Unauthorised*/ )); // as exact nhi btana email wrong ya password
    }

    // if matched, then
    sendToken(user, 200, res);
})

// Logout User
exports.logout = catchAsyncErrors(async(req, res, next) => {
    
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    })
})

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorHandler("User Not Found", 404 /* Not Found */));
    }

    // GetResetPasswordToken
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    
    const message = `Your Password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email
    then, please ignore it`;
    
    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,   
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })
    } 
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }
})

// Reset Password
exports.resetPassword = catchAsyncErrors(async(req, res, next) => {

    // Creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}, 
    })

    if(!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400 /* Bad Request */));
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not matched", 400 /* Bad Request */));
    }

    // changing user's password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res); // Logging in after reseting password

})

// Get User Details - khud user ko apni details dekhni ho
exports.getUserDetails = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id); //it always gives user as ye route vo hi access kr skta jisne login kr rkha h

    res.status(200).json({
        success: true,
        user,
    })

});

// Update User password
exports.updatePassword = catchAsyncErrors(async(req, res, next) => {
    // user milega hi as login k baad ka h ye route
    const user = await User.findById(req.user.id).select("+password");

    // we have made comparePassword function in userModel.js
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 400 )); 
    }

    if(req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res); 
})

// Update User Profile
exports.updateProfile = catchAsyncErrors(async(req, res, next) => {

    // if(!req.body.name || !req.body.email) {
    //     return next(new ErrorHandler("Please Enter Both Name and Email", 400));
    // }

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    // Adding cloudinary (For new Avatar)
    if(req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId); // deleting old image

        // setting up new image
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,  
    });

    res.status(200).json({
        success: true,  
    });

})

// Get all users - by admin
exports.getAllUsers = catchAsyncErrors(async(req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        sucess: true,
        users,
    })
})

// Get single user details - admin ko user ki details dekhni ho
exports.getSingleUser = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User does not exits with Id: ${req.params.id}`, 400));
    }

    
    res.status(200).json({
        sucess: true,
        user,
    })
})

// Update User Role - Admin
exports.updateUserRole = catchAsyncErrors(async(req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,  
    });

    if(!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,  
    });

})

// Delete User - Admin
exports.deleteUser = catchAsyncErrors(async(req, res, next) => {

    const user = await User.findById(req.params.id)

    
    
    if(!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
    }

    // Removing already Uploaded image from cloudinary
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId); // deleting old image


    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted Successfully",  
    });

})

