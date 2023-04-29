require("dotenv").config();

require('express-async-errors');

const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

// rest of the packages
const morgan = require("morgan");
mongoose.set('strictQuery', true);
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");


// Database ------------------------------------------------
const connectDb = require("./db/connect");

// Middleware ----------------------------------------------
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");


// Routers --------------------------------------------------
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");


const app = express();


app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());
app.use(express.static("./public"));
app.use(fileUpload());


// once we get back the cookie then with each request browser will send the cookie automatically
// with each request browser sends the cookie
// dummy for logging the cookie
app.get("/api/v1", async (req, res) => {

    const token = req.signedCookies;
    console.log("token from the cookie : ", token);

    res.send("Hello world ecommerce app");
});


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);



// suppose : /apples and this route is not present
app.use(notFoundMiddleware);
// if there is some error in some existing route
// if we throw an error in some existing route
// this is invoked from some successful request
app.use(errorHandlerMiddleware);



const port = process.env.PORT || 5000
const start = async () => {
    try {

        await connectDb(process.env.MONGO_URL);
        console.log("Connected to the database")

        app.listen(port, () => {
            console.log(`Server is listening on the port ${port}`)
        })

    }
    catch (error) {

    }
}

start();