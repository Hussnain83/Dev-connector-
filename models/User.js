const mongoose = require("mongoose");
 const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true,   // Email must be unique
  },
  password: {
    type: String,
    required: true, // Password is required
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  date: {
    type: Date,
    default: Date.now, // Auto-set to current date
  },
});

UserSchema.pre("save", async function (next){
  const user = this;
  if(!user.isModified("password"))
    return next();
  try{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  }
  catch(err){
    return next(err);

  }
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
  try{ 
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
  }
  catch(err){
    throw(err);
  }
};

module.exports = mongoose.model("User", UserSchema);

/*
🎯 Dummy Data Example:
{
  name: "Hussnain Dogar",
  email: "hussnain@example.com",
  password: "hashed_password_here",
  date: "2025-07-24T10:00:00Z"
}
*/
