const express = require("express");
const { authenticateUser, authorizePermission } = require("../middleware/authentication");

const { getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword } = require("../controllers/userController");

const router = express.Router();

// Only for the admin
router.route("/").get(authenticateUser, authorizePermission("admin", "owner"), getAllUsers);
router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);

// id one should be at the last
router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;