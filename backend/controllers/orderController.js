const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


// Create New Order
exports.newOrder = catchAsyncErrors(async(req, res, next) => {
    const {
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id, // jo login h user (tbhi kr skta h order place)
    });

    res.status(201).json({
        success: true,
        order,
    })
})

// Get Single Order (Order Details)
exports.getSingleOrder = catchAsyncErrors(async(req, res, next) => {

    const order = await Order.findById(req.params.id).populate(
        "user", 
        "name email" // populate se user ki id k corresponding database me se name and email bhi dedega with user ki id
    );

    if(!order) {
        return next(new ErrorHandler("Order Not Found with this id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    })
})

// Get LoggedIn User Orders (Order Details)
exports.myOrders = catchAsyncErrors(async(req, res, next) => {

    const orders = await Order.find({
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        orders,
    })
})

// Get All Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async(req, res, next) => {

    const orders = await Order.find();

    let totalAmount=0;
    
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
})

// Update Order Status -- Admin
exports.updateOrder = catchAsyncErrors( async(req, res, next) => {

    const order = await Order.findById(req.params.id);

    if(!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if(order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 404));
    }

    if(req.body.status==="Shipped") {
        order.orderItems.forEach( async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered") {
        order.deliveredAt = Date.now()
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order,
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    if(product.Stock > 0) product.Stock -= quantity;
    else product.Stock = 0;
    await product.save({validateBeforeSave: false});
}

// Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async(req, res, next) => {

    const order = await Order.findById(req.params.id);

    if(!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    })
})

