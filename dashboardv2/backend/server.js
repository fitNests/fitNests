const express = require("express"); //include express and cors
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config(); //have envt var in the dotenv files

//how to create express server
const app = express();
const port = process.env.PORT || 5000; //port the server will be on

//middleware
app.use(cors());
app.use(express.json()); //allows us to parse json - server will extend and receive json

/*
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true , useUnifiedTopology: true}
); 
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})
*/

//Connecting to local mongoDb

mongoose.connect("mongodb://127.0.0.1:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

//Add Routes
//const usersRouter = require("./routes/users"); //Add routes for users
const usersRouter = require("./routes/userRouter"); //Add routes for users
app.use("/users", usersRouter);

//TODO - Figure out what this is for
//Test user router
const testRouter = require("./routes/testusers"); //link to testuser routes
app.use("/testuser", testRouter);

const dataRouter = require("./routes/liveDataRouter");
app.use("/liveData", dataRouter);

//Trainee Router
const traineeRouter = require("./routes/trainee");
app.use("/trainee", traineeRouter);

//Exercise Router
const exerciseRouter = require("./routes/exerciseRouter");
app.use("/exercise", exerciseRouter);

//which port is being used for the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
