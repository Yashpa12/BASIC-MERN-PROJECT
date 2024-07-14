const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listings");
const methodOverride = require("method-override");
const ejsmate = require('ejs-mate')
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.engine('ejs',ejsmate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));



app.get("/listings", async (req, res) => {
  const allList = await Listing.find({});
  res.render("listings/index", { allList });
});

// creath path
app.get("/listings/new", async (req, res) => {
  res.render("listings/new");
});

// POST route to create a new listing
app.post("/listings", async (req, res) => {
  let { title, description, image, price, location, country } = req.body;
  try {
    let newListing = new Listing({
      title: title,
      description: description,
      image: image,
      price: price,
      location: location,
      country: country,
    });
    await newListing.save();
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    res.send("Error creating listing");
  }
});

// show the item details
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const showDetails = await Listing.findById(id);
  res.render("listings/show", { showDetails });
});

// edit
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const showDetails = await Listing.findById(id);
  res.render("listings/edit", { showDetails });
});

// update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let { title, description, image, price, location, country } = req.body;
  try {
    await Listing.findByIdAndUpdate(id, {
      title,
      description,
      image,
      price,
      location,
      country,
    });
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error updating listing:", err);
    res.send("Error updating listing");
  }
});

// delete routes
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deleteList = await Listing.findByIdAndDelete(id);
  console.log(deleteList);
  res.redirect("/listings");
});

app.get("/", (req, res) => {
  console.log("hii its root path");
  res.send("hitt , its is root path");
});

app.listen(8080, () => {
  console.log("app listening on port");
});
