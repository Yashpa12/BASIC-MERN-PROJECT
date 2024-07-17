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
const Review = require("./models/review");
const listings = require("./routes/listings");
const reviews = require("./routes/review");
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

// jaha par bhi /listings ayega vaha ham listings use karenge
app.use("/listings", listings);
// :id ye khali app.js tak simit rahata hai aur usake aage wale external tak ho jaate hai toh id reviews ke andar bhi jaaye esliye mergeparams ko use karte hai
app.use("/listings/:id/reviews", reviews);

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
