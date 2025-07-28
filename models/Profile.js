const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User collection
  },
  bio: {
    type: String, // Short description about the user
  },
  status: {
    type: String,
    enum: ["student", "developer", "intern", "manager", "other"], // Limited choices
    required: true,
  },
  skills: {
    type: [String], // Array of skills (e.g. ["HTML", "CSS", "Node.js"])
    required: true,
  },
  experience: [
    {
      title: {
        type: String,
        required: true, // e.g. Software Engineer
      },
      company: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
    },
  ],
  github: {
    type: String, // GitHub profile URL
  },
  linkedin: {
    type: String, // LinkedIn profile URL
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Profile", ProfileSchema);

/*
🔹 Dummy Profile:
{
  "user": "64cfe5a3b4aabc1234567890",
  "bio": "Passionate full-stack developer.",
  "status": "developer",
  "skills": ["HTML", "CSS", "JavaScript", "Node.js", "MongoDB"],
  "experience": [
    {
      "title": "Backend Developer",
      "company": "Tech Solutions",
      "description": "Built REST APIs using Express.js"
    }
  ],
  "education": [
    {
      "school": "Punjab University",
      "degree": "BS Computer Science",
      "fieldofstudy": "Software Engineering",
      "description": "Graduated with distinction."
    }
  ],
  "github": "https://github.com/ali-dev",
  "linkedin": "https://linkedin.com/in/aliraza"
}
*/
