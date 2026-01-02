const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listing");
const multer=require('multer');
const {storage} =require("../cloudConfig.js");
const upload=multer({storage})



// ---------------- INDEX + CREATE ----------------
router.route("/")
.get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.create)
  );

// ---------------- NEW ----------------
router.get("/new", isLoggedIn, listingController.new);

// ---------------- SHOW + UPDATE + DELETE ----------------
router.route("/:id")
  .get(wrapAsync(listingController.show))
  .put(
    isLoggedIn,
    isOwner,
     upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.update)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroy)
  );

// ---------------- EDIT ----------------
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm)
);

module.exports = router;
