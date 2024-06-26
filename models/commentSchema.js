const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const CommentSchema= new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true},
  body: { type: String, required: true, maxLength: 1000 },
  author: { type: String, required: true, maxLength: 100 },
  timeStamp: { type: Date, default: Date.now },
});

// Virtual for post URL
CommentSchema.virtual("url").get(function() {
  // We don't use an arrow function as we'll need the 'this' object
  return `/comment/${this._id}`;
});

// Virtual property for time stamp but formatted nicely.
CommentSchema.virtual("date").get(function() {
  // We don't use an arrow function as we'll need the 'this' object
  return DateTime.fromJSDate(this.timeStamp).toFormat('LLL dd, yyyy - h:mm a');
});

module.exports = mongoose.model("Comment", CommentSchema);
