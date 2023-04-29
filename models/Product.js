const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide product name"],
        maxLength: [100, "Name can not be more than 100 characters"]
    },
    price: {
        type: Number,
        required: ["Please provide product price"],
        default: 0
    },
    description: {
        type: String,
        required: [true, "Please provide product description"],
        maxLength: [500, "Description can not be more than 200 characters"]
    },
    image: {
        type: String,
        default: "/uploads/example.jpg"
    },
    category: {
        type: String,
        required: [true, "Please provide product category"],
        enum: ["office", "kitchen", "bedroom"]
    },
    company: {
        type: String,
        required: [true, "Please provide company"],
        enum: {
            values: ["ikea", "liddy", "marcos"],
            message: `{VALUE} is not supported`
        }
    },
    colors: {
        type: [String],
        default: ["#222"],
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    freeShipping: {
        type: Boolean,
        required: false,
    },
    inventory: {
        type: Number,
        required: true,
        default: 15
    },
    averageRating: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }
})

// Get the reviews of a single product
productSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "product",
    justOne: false

})

// when product is deleted then delete all its reviews because they dont make sense now
productSchema.pre("remove", async function (next) {
    // delete all reviews which are associated with this product
    await this.model("Review").deleteMany({ product: this._id });
})
const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;