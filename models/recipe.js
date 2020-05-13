const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Recipe = new Schema({
  title: {
    type: String,
    validate: {
      validator: function (value) {
        return value.length >= 3;
      },
    },
    required: [true, "Title is required"],
  },
  desc: {
    type: String,
  },
  ingredients: {
    type: Array,
  },
});

Recipe.pre("save", function (next) {
  console.log("Saving recipe...");
  next();
});

Recipe.post("save", function (doc) {
  console.log("Saved recipe...", doc);
});

module.exports = mongoose.model("Recipe", Recipe);
