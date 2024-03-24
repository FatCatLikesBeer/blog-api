const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const CommentSchema= new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true},
  body: { type: String, required: true, maxLength: 100 },
  author: { type: String, required: true, maxLength: 100 },
  timeStamp: { type: Date, default: Date.now },
});

// Virtual for post URL
CommentSchema.virtual("url").get(function() {
  // We don't use an arrow function as we'll need the 'this' object
  return `/post/${this._id}`;
});

// Virtual property for time stamp but formatted nicely.
CommentSchema.virtual("due_back_formatted").get(function() {
  // We don't use an arrow function as we'll need the 'this' object
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Comment", CommentSchema);
