const router = require('express').Router();// allows me to use express
let User = require('../models/homepage.model');// allows us to use the db Schema

//handles get request
router.route('/').get((req, res) => {
    User.find()
      .then(users => res.json(users)) //returns in json format
      .catch(err => res.status(400).json('Error: ' + err)); //returns a status 400 if error occurs
  });
  
  //Handles Post requests
  router.route('/add').post((req, res) => {
    const username = req.body.username;
  
    const newUser = new User({username});
  
    newUser.save()
      .then(() => res.json('User added!')) //after user added to dB
      .catch(err => res.status(400).json('Error: ' + err));
  });

module.exports = router;