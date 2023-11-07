const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      // unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      // required:true
    },
    googleId: {
      type: String,
    },
    fbId:{
      type:String,

    },
    role: {
      type: Boolean,
      // required: true,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

module.exports = User;
