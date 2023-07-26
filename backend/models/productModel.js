const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter product name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please Enter product Description"], 
    },
    price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        maxLength: [8, "Price cannot exceed 8 figures"],
    },
    ratings: {
        type: Number, 
        default: 0,
    },
    images: [ // images are multiple, so array of objects
        {
            // as we host images on cloudnary, so it provides us id and url
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String, 
                required: true,
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter product Category"],
    },
    Stock: {
        type: Number,
        require: [true, "Please Enter product Stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user : {
                type: mongoose.Schema.ObjectId,
                ref: "User",    
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                require: true,
            },
            comment: {
                type: String,
                required: true, // as while giving review, we need to write something
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Product", productSchema);