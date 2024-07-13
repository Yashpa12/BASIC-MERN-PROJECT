const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7RSzBp2oZChfPDxmRovtHzTIpTQcBIvwRmQ&s",
    set: (v) =>
      v === ""
        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7RSzBp2oZChfPDxmRovtHzTIpTQcBIvwRmQ&s"
        : v,
  },
  location: String,
  country: String,
});

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;
