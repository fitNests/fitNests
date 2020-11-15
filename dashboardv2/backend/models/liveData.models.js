const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const liveDataSchema = new Schema({
  pos: {
    type: Array,
    default: [],
  },
  type: {
    type: Number,
  },
  expectedPos: {
    type: Array,
    default: [],
  },
  user1action: {
    type: String,
  },
  user2action: {
    type: String,
  },
  user3action: {
    type: String,
  },
  delay: {
    type: Number,
  },
  user1features: {
    type: Array,
    default: [1, 1, 1, 1, 1, 1],
  },
  user2features: {
    type: Array,
    default: [0, 0, 0, 0, 0, 0],
  },
  user3features: {
    type: Array,
    default: [4, 4, 4, 4, 4, 4],
  },
});

const LiveData = mongoose.model("LiveData", liveDataSchema); // what does the firs field denote

module.exports = LiveData;
