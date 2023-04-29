const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minLength: 3,
        maxLength: 25

    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Please provide valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minLength: 6
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
})

UserSchema.pre("save", async function () {

    // Only hash the password if we are modfying the password , or at the time we are creating the user
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

})

UserSchema.methods.comparePassword = async function (providedPassword) {

    const isMatched = await bcrypt.compare(providedPassword, this.password);

    return isMatched;

}

const UserModel = mongoose.model("User", UserSchema);



module.exports = UserModel