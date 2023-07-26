const express = require("express");
const router = express.Router();

const { 
    getAllProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProductDetails, 
    createProductReview, 
    getProductReviews,
    deleteReview,
    getAdminProducts
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


router.route("/products").get(getAllProducts); // anyone

router.route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router.route("/admin/product/new")
.post(isAuthenticatedUser, authorizeRoles("admin"), createProduct); // admin

router
    .route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct) // admin
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct); // admin

router.route("/product/:id").get(getProductDetails); // anyone

router.route("/review").put(isAuthenticatedUser, createProductReview); // logged in user

// get has not isAuthenticatedUser function as jaroori nhi jise review dekhna h vo login ho
router.route("/reviews")
.get(getProductReviews) // anyone
.delete(isAuthenticatedUser, deleteReview); // logged in user

module.exports = router;
