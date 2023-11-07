const mongoose = require('mongoose')
async function connnectDb() {
    try {
    //   await mongoose.connect("mongodb://127.0.0.1:27017/raeesi");
      await mongoose.connect(process.env.DB_URL);
     
      console.log("connected to  db");
    } catch (error) {
      console.log("OOPs something went wrong", error);
    }
  }

  module.exports = connnectDb