

const createTokenUser = (user) => {

    console.log("In create token user function");
    const tokenUser = {
        name: user.name,
        userId: user._id,
        role: user.role
    }

    return tokenUser
}

module.exports = createTokenUser;