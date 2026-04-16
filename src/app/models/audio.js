const mongoose = require("mongoose");

const AudioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    audioname: {
      type: String,
      required: true
    },
    audiourl: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Audio", AudioSchema);