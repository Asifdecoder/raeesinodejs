const mongoose = require("mongoose");



let menSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  img: {
    type: String,
  },
  price: {
    type: String,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  reviews:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }
]
});

// collection created with the instanceof product

let Menproduct = mongoose.model("Menproduct", menSchema);

module.exports = Menproduct;
