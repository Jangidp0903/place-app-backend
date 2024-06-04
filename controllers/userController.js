const User = require("../models/user");
const HttpError = require("../models/http-error");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const saltRounds = 11;

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password"); //exclude password from response
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );
    return next(error);
  }

  if (!users || users.length === 0) {
    const error = new HttpError("Could not find any users.", 404);
    return next(error);
  }

  res.json({ users: users });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("LoginFailed,Please try again later.", 500);
    return next(err);
  }
  if (!existingUser) {
    const err = new HttpError("Invalid credentials,could not log you in", 500);
    return next(err);
  }

  console.log(existingUser);

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    const err = new HttpError(
      "Could not log you in,please check your credentials and try again",
      500
    );
    return next(err);
  }

  if (!isValidPassword) {
    const err = new HttpError(
      "Invalid Credentials!,Could not log you in.",
      500
    );
    return next(err);
  }
  res.json({ message: "Logged in Successfully" });

  console.log(isValidPassword);
};

const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new HttpError("Invalid Input Passed,check data", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Signup failed, please try again later", 500);
    return next(err);
  }

  if (existingUser) {
    const error = new HttpError("User already exists!,Login Instead", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, saltRounds);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name: name,
    email: email,
    password: hashedPassword, // Store hashed password
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed , please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser });
};

const userController = {
  getUsers: getUsers,
  login: login,
  signup: signup,
};

module.exports = userController;
