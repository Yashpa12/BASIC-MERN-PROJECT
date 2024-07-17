const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const Listing = require("../models/listings");
const ExpressError = require("../utils/ExpressError");

// Get all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allList = await Listing.find({});
    res.render("listings/index", { allList });
  })
);

// Create path
router.get("/new", (req, res) => {
  res.render("listings/new");
});

// POST route to create a new listing
router.post(
  "/",
  wrapAsync(async (req, res) => {
    const { title, description, image, price, location, country } = req.body;
    if (!title || !description || !image || !price || !location || !country) {
      throw new ExpressError(400, "All fields are required");
    }
    const newListing = new Listing({
      title,
      description,
      image,
      price,
      location,
      country,
    });
    await newListing.save();
    res.redirect("/listings");
  })
);

// Show the item details
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const showDetails = await Listing.findById(id).populate('reviews');
    if (!showDetails) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/show", { showDetails });
  })
);

// Edit listing
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const showDetails = await Listing.findById(id);
    if (!showDetails) {
      throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit", { showDetails });
  })
);

// Update route
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, image, price, location, country } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(id, {
      title,
      description,
      image,
      price,
      location,
      country,
    }, { new: true, runValidators: true });
    if (!updatedListing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.redirect(`/listings/${id}`);
  })
);

// Delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.redirect("/listings");
  })
);

module.exports = router;
