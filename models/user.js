const mongoose = require("mongoose");

// const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  email: { type: String, minLength: 8, required: true, unique: true },
  password: { type: String, minLength: 8, required: true },
  places: [{ type: mongoose.Types.ObjectId, ref: "Place" }],
});

// userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
