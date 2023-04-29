const User = require("../models/User");
const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors");
const { attachCookiesToReponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
    const { name, email, password } = req.body;

    // 1).checking if email already taken
    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
        throw new CustomError.BadRequestError("Email already in use");
    }

    // 2).First registered user is admin
    const isFirstAccount = await User.countDocuments({}) === 0;
    const role = isFirstAccount ? "admin" : "user"

    // 3).Creating a new user
    const user = await User.create({
        name, email, password, role
    });

    // 4).payload for the token
    const tokenUser = createTokenUser(user);

    await attachCookiesToReponse({ user: tokenUser, res })

    res.status(StatusCodes.CREATED).json({
        user: tokenUser
    })
}
const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new CustomError.BadRequestError("Please provide email and password ");
    }
    // Getting the user with the provided email
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError.UnauthenticatedError("Invalid Email");
    }


    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError("Invalid Password");
    }

    // 4).payload for the token
    const tokenUser = createTokenUser(user);
    await attachCookiesToReponse({ user: tokenUser, res });

    res.status(StatusCodes.OK).json({
        user: tokenUser
    })
}
const logout = async (req, res) => {

    // In 5 seconds cookie disappears
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now())
    });
    res.status(StatusCodes.OK).json({
        msg: "user logged out!"
    })
}


module.exports = {
    register,
    login,
    logout
}