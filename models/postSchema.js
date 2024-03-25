const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  body: { type: String, required: true, maxLength: 100 },
  author: { type: String, default: "Billy" },
  timeStamp: { type: Date, default: Date.now },
  type: {
    type: String,
    required: true,
    enum: ["Article", "Blurb", "Link", "Media"],
    default: "Article",
  },
});

// Virtual for post URL
PostSchema.virtual("url").get(function() {
  // We don't use an arrow function as we'll need the 'this' object
  return `/post/${this._id}`;
});

// Virtual property for time stamp but formatted nicely.
PostSchema.virtual("due_back_formatted").get(function() {
  // We don't use an arrow function as we'll need the 'this' object
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Post", PostSchema);
