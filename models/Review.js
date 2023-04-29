const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Please provide rating"]
    },
    title: {
        type: String,
        trim: true,
        maxLength: 100,
        required: [true, "Please provide review title"]
    },
    comment: {
        type: String,
        required: [true, "Please provide review text"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true
    }
}, { timestamps: true }
);

// // User can only make one review per product
// // No multiple reviews by the same user on the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;