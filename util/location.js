const axios = require("axios");
const HttpError = require("../models/http-error");

// const API_KEY = "jhjhfcgfcmhfkjuyhlbjhuy";

const getCoordsForAddress = async (address) => {
  return {
    lat: "23.5435",
    lng: "54.7777",
  };

  //   const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`)
  //   const data = response.data

  // if(!data || data.status ==="ZERO_RESULTS){
  // throw new HttpError("Could not find location for the specified address", 422)
  // }

  // const coordinates = data.results[0].geometry.location;

  // return coordinates;
};

module.exports = getCoordsForAddress;
