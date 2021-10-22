const mongoose = require("mongoose");
const { Schema } = mongoose;

const GameSchema = new Schema({
  title: String,
  players: [{ name: String, leader: { type: Boolean, default: false } }],
  state: {
    type: String,
    enum: ["created", "started", "paused", "finished"],
    default: "created",
  },
});

module.exports = mongoose.model("GameRoom", GameSchema);
