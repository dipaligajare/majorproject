const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const  Review =require("./review.js");
const { required } = require("joi");
const listingSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },

  description: {
    type: String
  },

  image: {
    url:String,
    filrname:String,
  },

  price: Number,
  location: String,
  country: String,

  // ⭐ FIXED — reviews array must have a default empty array
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in :listing.reviews}});

  }
  
});

module.exports = mongoose.model("Listing", listingSchema);
