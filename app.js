require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");

const app = express();
const PORT = 5000;

mongoose
  .connect(
    "mongodb+srv://puneetjangid637:admin_puneet_jangid@cluster0.kpaeogh.mongodb.net/places-appDB?retryWrites=true&w=majority&appName=Cluster0"
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
app.use(userRoutes);
app.use(placesRoutes);
