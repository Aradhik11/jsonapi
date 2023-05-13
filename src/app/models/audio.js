const mongoose = require("mongoose");

const AudioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
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