const { Schema, model } = require("mongoose");

let welcomeSchema = new Schema({
  Guild: String,
  Channel: String,
  Message: String,
  Role: String,
});

module.exports = model("welcome", welcomeSchema);
