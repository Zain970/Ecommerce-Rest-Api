const express = require("express");

const authRouter = express.Router();

const { register, login, logout } = require("../controllers/authController");

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/logout").get(logout);

module.exports = authRouter;

