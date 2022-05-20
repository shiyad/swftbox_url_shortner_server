const mongoose = require("mongoose");
const shortId = require("shortid");

const swftboxUrlSchema = new mongoose.Schema({
  host: {
    type: String,
    required: true,
  },
  fullUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: shortId.generate,
  },
  clicksCounter: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("swftboxUrl", swftboxUrlSchema);
