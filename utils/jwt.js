const jwt = require("jsonwebtoken");


const createToken = async ({ payload }) => {

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })

    return token;
}

const isTokenValid = async ({ token }) => {

    return jwt.verify(token, process.env.JWT_SECRET);
}

const attachCookiesToReponse = async ({ user, res }) => {

    // creating a token
    const token = await createToken({ payload: user });

    const oneDay = 1000 * 60 * 60 * 24;

    // placing jwt-token in the cookie
    // attaching cookie to the response with signed and secure

    res.cookie("token", token, {
        httpOnly: true,
        expiresIn: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === "production",
        signed: true
    })
}

module.exports = {
    createToken,
    isTokenValid,
    attachCookiesToReponse
}