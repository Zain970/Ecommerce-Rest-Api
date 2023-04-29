const express = require("express");

const { authenticateUser, authorizePermission } = require("../middleware/authentication");

const {
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    createProduct } = require("../controllers/productController");


const { getSingleProductReviews } = require("../controllers/reviewController");

const router = express.Router();

router.route("/")
    .post(authenticateUser, authorizePermission("admin"), createProduct)
    .get(getAllProducts);



router.route("/uploadImage")
    .post(authenticateUser, authorizePermission("admin"), uploadImage);

router.route("/:id")
    .get(getSingleProduct)
    .delete(authenticateUser, authorizePermission("admin"), deleteProduct)
    .patch(authenticateUser, authorizePermission("admin"), updateProduct)

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;

