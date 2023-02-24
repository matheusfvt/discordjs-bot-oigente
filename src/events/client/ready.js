const mongoose = require("mongoose");
const { mongoDb } = require("../../../config.json");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await mongoose.connect(mongoDb || "", {
      keepAlive: true,
    });

    if (mongoose.connect) {
      console.log("MongoDB connected!");
    }
    await console.log(`${client.user.tag} is logged in and online`);
  },
};
