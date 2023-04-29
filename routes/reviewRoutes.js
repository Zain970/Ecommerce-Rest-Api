const express = require("express");

const { authenticateUser } = require("../middleware/authentication");

const { createReview,
    getAllReviews,
    getSingleReview,
    deleteReview,
    updateReview } = require("../controllers/reviewController");

const router = express.Router();

router.route("/")
    .get(authenticateUser, getAllReviews)
    .post(authenticateUser, createReview);

router.route("/:id")
    .get(authenticateUser, getSingleReview)
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview)

module.exports = router;