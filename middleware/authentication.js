const CustomError = require("../errors");
const { isTokenValid } = require("../utils/jwt");

// 1).We first want to authenticate the user
// First we check in general if the user exists
const authenticateUser = async (req, res, next) => {

    const token = req.signedCookies.token;

    if (!token) {
        throw new CustomError.UnauthenticatedError("Authentication failed")
    }
    try {
        const payload = await isTokenValid({ token });
        console.log("Current User : ", payload);
        req.user = {
            name: payload.name,
            userId: payload.userId,
            role: payload.role
        }
        next();
    }
    catch (error) {
        throw new CustomError.UnauthenticatedError("Authentication Invalid")
    };
};
// 2).Then look for the admin
// Check for the admin

const authorizePermission = (...roles) => {

    return ((req, res, next) => {

        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError("Unauthorized to access this route");
        }
        next();
    });
};
module.exports = {
    authenticateUser,
    authorizePermission
}