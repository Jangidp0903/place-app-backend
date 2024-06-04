const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const placesController = require("../controllers/placesController.js");

// get Place by Id
router.get("/:pid", placesController.GETPLACEBYID);

// // get places by userid
// router.get("/user/:uid", placesController.GETPLACEBYUSERID);

// // delete place
router.delete("/:pid", placesController.DELETEPLACE);

// create place
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 8 }),
    check("address").not().isEmpty(),
  ],
  placesController.CREATEPLACE
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 8 })],
  placesController.UPDATEPLACEBYID
);
module.exports = router;
