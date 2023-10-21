const express = require("express");
const router = express.Router({mergeParams: true});
const WrapAsync = require('../utils/WrapAsync.js');
const ExpressError = require('../utils/ExpressError.js')
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn} =require("../middleware.js");



//-----------------------------------------REVIEWS........................................................
//POST ROUTE
router.post("/", isLoggedIn, validateReview, WrapAsync( async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash('success', 'New Review Created');
    res.redirect(`/listings/${listing._id}`);
}));


router.delete("/:reviewId", WrapAsync( async(req, res) => {
    let {id, reviewId} = req, params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findOneAndDelete(reviewId);
    req.flash('success', 'Review Deleted');
    res.redirect(`/listings/${id}`)
}));

module.exports = router;