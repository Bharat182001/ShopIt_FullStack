const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require('cloudinary');



// Create Product -- Admin Route
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];

    if(typeof req.body.images==="string") { // single url found, only 1 image is there
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], { // uploading each image on Cloudinary
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        })
    }

    req.body.images = imagesLinks; // now req.body.images has cloudinary uploaded links rather than local system ones
    req.body.user =  req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    })
});

// Get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .pagination(resultPerPage)
    .filter()
    
    const products = await apiFeature.query;  

    res.status(200).json({
        success: true,
        products,    
        productsCount,
        resultPerPage,
    });
});

// Get All Products (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

// Get Single Product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    // product not found
    if(!product) { 
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    })
});

// Update Product -- Admin Route
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    // product not found
    if(!product) { 
        return next(new ErrorHandler("Product not found", 404));
    }

    // Images start here
    let images = [];

    if(typeof req.body.images==="string") { // single url found, only 1 image is there
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if(images !== undefined) {
        // Deleting Images from cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], { // uploading each image on Cloudinary
                folder: "products",
            });
    
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            })
        }

        req.body.images = imagesLinks;
    }

    

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,
        product,
    })
});

// Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    // product not found
    if(!product) { 
        return next(new ErrorHandler("Product not found", 404));
    }

    // Deleting Images from cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    })
});

// Create new Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const {rating , comment, productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating), // It must be number only
        comment,
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString()===req.user._id.toString()
    );

    if(isReviewed) {
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        })
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Finding average of all ratings
    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating;
    })
    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
    })

})

// Get All reviews of a single product
exports.getProductReviews = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 400));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})

// Delete Review
exports.deleteReview = catchAsyncErrors(async(req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if(!product) {
        return next(new ErrorHandler("Product Not Found", 400));
    }

    // It has all those reviews which we don't want to delete
    const reviews = product.reviews.filter( rev => rev._id.toString() !== req.query.id.toString())

    // Again finding new ratings of all ratings after deleting review
    let avg = 0;
    reviews.forEach(rev => {
        avg += rev.rating;
    })

    let ratings = 0;
    
    if(reviews.length === 0) {
        ratings = 0;
    }else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews, ratings, numOfReviews,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
    })
})
