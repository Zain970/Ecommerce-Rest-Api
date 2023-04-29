const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");

// ?sort=ratings&fields=title,price,ratings
// ?sort=-name,price&fields=company,rating
const getAllProducts = async (req, res) => {

    // console.log("req.body : ", req.body);
    const { category, name, company, sort, fields } = req.query;

    let queryObj = {}
    if (category) {
        queryObj.category = { $regex: category, $options: "i" }
    }
    if (name) {
        queryObj.name = { $regex: name, $options: "i" }
    }
    if (company) {
        queryObj.company = { $regex: company, $options: "i" }
    }

    console.log("queryObj : ", queryObj)

    let result = Product.find(queryObj);

    // 1).------ sorting ------

    if (sort) {
        const sortList = sort.split(",").join(" ");
        console.log("sort list : ", sortList);
        result = result.sort(sortList);
    }
    else {
        result = result.sort("price")
    }

    // 2).------ projection ------

    if (fields) {
        const fieldList = fields.split(",").join(" ");
        console.log("field list : ", fieldList);
        result = result.select(fieldList);
    }

    // 3).------ pagination ------
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const products = await result;

    res.status(200).json({
        count: products.length,
        products
    })
}

const getSingleProduct = async (req, res) => {

    const { id: productId } = req.params;

    const product = await Product.findOne({ _id: productId }).populate("reviews");

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${req.params.id}`)
    }

    res.status(200).json({
        product
    })
}

const uploadImage = async (req, res) => {
    console.log("------------- req.files ---------- : ", req.files);

    // check if the file is attached
    if (!req.files) {
        throw new CustomError.BadRequestError("No File Uploaded");
    }

    const productImage = req.files.image;
    console.log("------------- productImage --------- : ", productImage);

    if (!productImage.mimetype.startsWith("image")) {
        throw new CustomError.BadRequestError("Please Upload Image");
    }

    const maxSize = 1024 * 1024;

    if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError("Please upload image size smaller than 1MB");
    }

    const imagePath = path.join(__dirname, "../public/uploads/" + `${productImage.name}`)
    console.log("imagePath : ", imagePath);

    // Moving the image to the specified path
    await productImage.mv(imagePath);


    res.status(StatusCodes.OK).json({
        image: `/uploads/${productImage.name}`
    })

}

const createProduct = async (req, res) => {

    req.body.user = req.user.userId;
    const product = await Product.create(req.body);

    res.status(StatusCodes.CREATED).json({
        product
    })
}


const deleteProduct = async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${req.params.id}`)
    }

    await Product.remove();

    res.status(StatusCodes.OK).json({
        msg: "Product Removed! ",

    })
}

const updateProduct = (req, res) => {
    const { id: productId } = req.params;

    const product = Product.findOneAndUpdate({ _id: productId }, req.body, {
        new: true,
        runValidators: true
    })

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id : ${req.params.id}`)
    }

    res.status(StatusCodes.Ok).json({
        product
    })
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct,
    createProduct,

    uploadImage

}