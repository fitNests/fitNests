
const express = require('express'); //include express and cors
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); //have envt var in the dotenv files

//how to create express server
const app = express();
const port = process.env.PORT || 5000; //port the server will be on

//middleware
app.use(cors());
app.use(express.json()); //allows us to parse json - server will extend and receive json

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
); 
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})



//To add Routes 
const homepageRouter = require('./routes/homepage'); //points to this route
app.use('/homepage', homepageRouter); // used to setup the local routes



//which port is being used for the server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});