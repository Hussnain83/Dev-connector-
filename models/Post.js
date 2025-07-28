const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // The user who created the post
  },
  text: {
    type: String,
    required: true, // Content of the post
  },
  name: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Users who liked the post
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
        required: true, // Comment content
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Post", PostSchema);

/*
🔹 Dummy Post:
{
  "user": "64cfe5a3b4aabc1234567890",
  "text": "Today I deployed my first Node.js app!",
  "name": "Ali Raza",
  "likes": [
    { "user": "64cfe5a3b4aabc9876543210" }
  ],
  "comments": [
    {
      "user": "64cfe5a3b4aabc9876543210",
      "text": "Congrats bro!",
      "date": "2025-07-24T12:00:00Z"
    }
  ]
}
*/
