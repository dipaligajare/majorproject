const Listing = require("../models/listing");

// ---------------- DEFAULT IMAGES ----------------
const defaultImages = [
  "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1581291519195-ef11498d1cfb?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60"
];

// ---------------- INDEX ----------------
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// ---------------- NEW ----------------
module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
};

// ---------------- CREATE ----------------
module.exports.create = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

// ---------------- SHOW ----------------
module.exports.show = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// ---------------- EDIT FORM ----------------
module.exports.editForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listings");
  }

  let originalImageurl = listing.image?.url;
  if (originalImageurl) {
    originalImageurl = originalImageurl.replace(
      "/upload",
      "/upload/w_250"
    );
  }

  res.render("listings/edit.ejs", { listing, originalImageurl });
};

// ---------------- UPDATE ----------------
module.exports.update = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(
    id,
    req.body.listing,
    { new: true }
  );

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await listing.save();
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// ---------------- DELETE ----------------
module.exports.destroy = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
