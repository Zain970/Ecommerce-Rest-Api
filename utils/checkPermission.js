const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {

    // if user is admin then no issue , user details can be send back
    if (requestUser.role === "admin") {

        // console.log("I am admin and can access the user");

        return;
    }
    // if the user is himself then no issue , user details can be send back
    else if (requestUser.userId === resourceUserId.toString()) {
        // console.log("I am the user himself");

        return
    }
    // if one user is trying to access any other user then issue
    else {
        throw new CustomError.UnauthorizedError("Unauthorized to access this route");
    }
}

module.exports = checkPermissions;