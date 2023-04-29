const Review = require("../models/Review");
const Product = require("../models/Product")
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const { checkPermissions } = require("../utils")


const createReview = async (req, res) => {
    // 1).Handle for the non existing product 
    // 2).Check if the user has already submitted the review

    const { product: productId } = req.body;

    // If product exists for which we are creating a review
    const isValidProduct = await Product.findOne({ _id: productId });
    if (!isValidProduct) {
        throw new CustomError.NotFoundError(`No product with id :${productId}`)
    }

    // If user has already submitted a review for this specific product
    const alreadySubmitted = await Review.findOne({
        product: productId,
        user: req.user.userId
    })
    if (alreadySubmitted) {
        throw new CustomError.BadRequestError("Already submitted review for this product")
    }

    // Every review is created by some user
    req.body.user = req.user.userId;

    console.log("req.body : ", req.body);

    const review = await Review.create(req.body);

    res.status(StatusCodes.OK).json({
        review
    })

}
const getAllReviews = async (req, res) => {

    // populate also returns the information about the product this review belongs to and the user who created this review
    const reviews = await Review.find({})
        .populate({
            path: "product",
            select: "name company price"
        })
        .populate({
            path: "user",
            select: "name email role"
        })

    res.status(StatusCodes.OK).json({
        reviews,
        count: reviews.length
    })
}
const getSingleReview = async (req, res) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
    }

    res.status(StatusCodes.OK).json({
        review
    })
}
const updateReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
    }

    // Only the user which created that review can delete it and the admin
    checkPermissions(req.user, review.user);

    // Updating the review
    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();

    res.status(StatusCodes.OK).json({
        review
    })
}

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId });

    if (!review) {
        throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
    }

    // Only the user which created that review can delete it and the admin can also
    checkPermissions(req.user, review.user);

    await review.remove();

    res.status(StatusCodes.OK).json({
        msg: "review deleted"
    })
}

// Get all reviews associated with a specific product
const getSingleProductReviews = async (req, res) => {

    const { id: productId } = req.params;

    console.log("Id : ", productId);

    // Find all reviews where product is : 

    const reviews = await Review.find({ product: productId })

    console.log("reviews : ", reviews);

    res.status(StatusCodes.OK).json({
        reviews,
        count: reviews.length
    })
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}