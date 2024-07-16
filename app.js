const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listings");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync");
const ExpressError = require("./utils/ExpressError");
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allList = await Listing.find({});
    res.render("listings/index", { allList });
  })
);

// creath path
app.get(
  "/listings/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new");
  })
);

// POST route to create a new listing
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    let { title, description, image, price, location, country } = req.body;
    if (!title || !description || !image || !price || !location || !country) {
      throw new ExpressError(400, "send valid data  ");
    }
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
  })
);

// show the item details
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const showDetails = await Listing.findById(id);
    res.render("listings/show", { showDetails });
  })
);

// edit
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const showDetails = await Listing.findById(id);
    res.render("listings/edit", { showDetails });
  })
);

// update route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;

    const updatedListing = await Listing.findByIdAndUpdate(id, {
      title,
      description,
      image,
      price,
      location,
      country,
    });
    if (!updatedListing) {
      throw new ExpressError(404, "Listing not found");
    }
    res.redirect(`/listings/${id}`);
  })
);

// delete routes
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteList = await Listing.findByIdAndDelete(id);
    console.log(deleteList);
    res.redirect("/listings");
  })
);

app.get("/", (req, res) => {
  console.log("hii its root path");
  res.send("hitt , its is root path");
});

// custom validation
// app.use((err, req, res, next) => {
//   res.send("somthing is wrong");
// });

//if any no path are available so standard res
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});
// ExpressError
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("app listening on port");
});
