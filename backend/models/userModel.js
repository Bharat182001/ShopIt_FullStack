const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // no need to install it, already built-in module

const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more that 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false, // ye field nhi milegi find() method call krne pr if select is false
    },
    avatar: {
        // as we host images on cloudnary, so it provides us id and url
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String, 
            required: true,
        }
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) { // as we can't use this keyword in arrow function

    if(!this.isModified("password")) { // that means password field is not modified by user (name, email hi update kia h)
        next(); // kuch hash nhi krna (not encrypt again) (means hashed password ko again nhi kia)
    }

    this.password = await bcrypt.hash(this.password, 10);
})

// JWT Token (for -> register krte hi login bhi apne aap ho jae)
// token generate krke cookie me store kr lo so that server will know this is user who can access routes
userSchema.methods.getJWTToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,

    })
}

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {

    // Generating Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex"); // it generates a token of 20 random bytes

    // Hasing and Adding to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000;

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);