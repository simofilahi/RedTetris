const mongoose = require("mongoose");
const { Schema } = mongoose;

const GameSchema = new Schema({
  title: String,
  players: [
    {
      name: String,
      role: {
        type: String,
        enum: ["leader", "follower"],
        default: "follower",
      },
    },
  ],
  state: {
    type: String,
    enum: ["created", "started", "paused", "finished"],
    default: "created",
  },
  multiplayer: {
    type: Boolean,
    default: false,
  },
  gravityInterval: {
    type: Number,
    default: 800,
  },
});

module.exports = mongoose.model("TetrisRooms", GameSchema);
