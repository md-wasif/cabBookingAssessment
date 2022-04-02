const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  phone: {
      type: String,
      default: "",
  },
  location: [
    {
      address: {
        type: String,
        default: ""
      },
      state: {
          type: String,
          default: ""
      },
      city: {
          type: String,
          default: ""
      },
      zipcode: {
          type: Number,
          default: 0
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  ],
  status: {
    type: Boolean,
    default: true,
  },
});

var userModel = mongoose.model("userSchema", userSchema, "userSchema");
module.exports = userModel;
