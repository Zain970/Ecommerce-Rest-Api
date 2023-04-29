const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToReponse, createTokenUser, checkPermissions } = require("../utils");


const getAllUsers = async (req, res) => {

    const users = await User.find({ role: "user" }).select("-password");

    res.status(StatusCodes.OK).json({
        length: users.length,
        users
    });
}
const getSingleUser = async (req, res) => {
    const { id } = req.params;

    const user = await User.findOne({ _id: id }).select("-password");

    if (!user) {
        throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`)
    }

    checkPermissions(req.user, user._id);
    res.status(200).json({
        user
    });
};


const showCurrentUser = async (req, res) => {

    res.status(StatusCodes.OK).json({
        user: req.user
    })
}

// Update user with user.save
// Using saving we are triggering the hook
const updateUser = async (req, res) => {
    const { email, name } = req.body;

    // if name and email not provided
    if (!name || !email) {
        throw new CustomError.BadRequestError("Please provide all values!")
    }

    const user = await User.findOne({ _id: req.user.userId });
    console.log("user : ", user);

    user.name = name;
    user.email = email;

    // Issue is that password is hashed one more time because mongoose hooks are called
    await user.save();

    // creating the token
    const tokenUser = createTokenUser(user);

    // attaching the cookie to the response
    // changing the name so again create token because token is geenrated using name payload
    await attachCookiesToReponse({ user: tokenUser, res })

    res.status(StatusCodes.OK).json({
        user: tokenUser
    })
}

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;


    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError("Please provide old and new password");
    }

    const user = await User.findOne({ _id: req.user.userId });

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError("Invalid Creentials");
    }

    user.password = newPassword;
    user.save();

    res.status(StatusCodes.OK).json({
        msg: "Success ! Password Updated"
    })

}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUserPassword,
    updateUser
}


//1). We did not trigger the hook
//2). Update User with findOneandUpdate
// const updateUser = async (req, res) => {
//     const { email, name } = req.body;

//     // if name and email not provided
//     if (!name || !email) {
//         throw new CustomError.BadRequestError("Please provide all values!")
//     }

//     const user = await User.findByIdAndUpdate(
//         { _id: req.user.userId },
//         { email, name },
//         { new: true, runValidators: true }
//     )

//     // creating the token
//     const tokenUser = createTokenUser(user);

//     // attaching the cookie to the response
//     await attachCookiesToReponse({ user: tokenUser, res })

//     res.status(StatusCodes.OK).json({
//         user: tokenUser
//     })
// }