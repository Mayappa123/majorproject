const express = require("express");
const router = express.Router();
const WrapAsync = require('../utils/WrapAsync.js');
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, ValidateListing, validateReview} = require("../middleware.js");
const listingController = require("../controllers/listings");

router.get('/new', isLoggedIn, listingController.renderNewForm); //new route

router.route("/")
    .get( WrapAsync(listingController.index))   //index route
    .post( isLoggedIn, ValidateListing, WrapAsync(listingController.createListing))  //create route

router.route("/:id")
    .get( WrapAsync(listingController.showListing)) //show route
    .put( isLoggedIn, ValidateListing, isOwner,  WrapAsync(listingController.updateListing)) //update route
    .delete( isLoggedIn, isOwner, WrapAsync(listingController.destroyListing)) //delete route

router.get('/:id/edit', isLoggedIn, isOwner, WrapAsync(listingController.renderEditForm)); //edit route

module.exports = router;