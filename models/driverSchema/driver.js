const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const driverSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  location: [
    {
      address: {
        type: String,
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
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Driver", driverSchema);
