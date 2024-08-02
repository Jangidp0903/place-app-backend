require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");

const app = express();
const PORT = 4000;

mongoose
  .connect(
    "mongodb+srv://Admin-Rohan:admin_rohan_sharma@cluster0.2vxj1.mongodb.net/itc-places-app-db"
  )
  .then(() => {
    console.log("Connected To DB");
    app.listen(PORT, () => {
      console.log("Server started on port", PORT);
    });
  })
  .catch((err) => {
    console.log("error while connecting to db =>", err);
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/users/", userRoutes);
app.use(placesRoutes);
