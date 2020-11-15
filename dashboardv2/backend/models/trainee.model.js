const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const traineeSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  age: {
    type: Number,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
  },
  plan: {
    type: String,
  },
});

const Trainee = mongoose.model("Trainee", traineeSchema);

module.exports = Trainee;
