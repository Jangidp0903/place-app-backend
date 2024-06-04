const Place = require("../models/place");
const mongoose = require("mongoose");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");

const { validationResult } = require("express-validator");

const GETPLACEBYID = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find place by ID ",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place by ID provided", 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const CREATEPLACE = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid Input Passed,check data", 422));
  }

  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    const error = new HttpError(
      "Failed to get coordinates of the given address",
      500
    );
    return next(error);
  }

  const createdPlace = new Place({
    title,
    address,
    description,
    location: coordinates,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Failed to find user", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Cound find user by user id", 404);
    return next(error);
  }

  console.log("found user", user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Failed to create new place", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
};

const DELETEPLACE = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    // Access user using populate
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    console.log(err);
    return next(
      new HttpError("Something went wrong! Could not delete place", 500)
    );
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    // Remove place from user
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      500
    );
    return next(error);
  }
  res.status(200).json({
    message: "Deleted Place",
    place: place.toObject({ getters: true }),
  });
};

const UPDATEPLACEBYID = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid Input Passed,check data", 422));
  }
  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while searching for place by id",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not found place by id", 404);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the updates",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const placesController = {
  GETPLACEBYID,
  CREATEPLACE,
  DELETEPLACE,
  UPDATEPLACEBYID,
};

module.exports = placesController;
