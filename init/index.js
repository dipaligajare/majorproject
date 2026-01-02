const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { data } = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// ✅ DEFAULT IMAGE (VERY IMPORTANT)
const defaultImage = {
  url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  filename: "default-image"
};

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to DB");

  // ❌ deleteMany causes data loss, but keeping it since you used it
  await Listing.deleteMany({});
  console.log("🗑 Old listings deleted");

  const ownerId = new mongoose.Types.ObjectId("6950059e6ecf4099cd8b8371");

  // ✅ ADD IMAGE + OWNER
  const listingsWithOwner = data.map((obj) => ({
    ...obj,
    owner: ownerId,
    image: defaultImage
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log("✅ New listings inserted");

  mongoose.connection.close();
}

main().catch(err => {
  console.error("❌ Error:", err);
});
