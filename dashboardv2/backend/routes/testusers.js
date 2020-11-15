const router = require("express").Router();
//const Testuser = require('../models/testuser.model');
let TestUser = require("../models/testuser.model");

//USED to handle CRUD Operations
//first endpoint that handles http get request
router.route("/").get((req, res) => {
  TestUser.find()
    .then((testUser) => res.json(testUser)) //returns user in json format
    .catch((err) => res.status(400).json("Error: " + err));
});

//Whenever theres an add prefix it stores it inside the mongodb Database
router.route("/add").post((req, res) => {
  const id = req.body.id;
  const pos = req.body.pos;
  const action = req.body.action;
  const delay = Number(req.body.delay);
  const user1 = req.body.user1;
  const user2 = req.body.user2;
  const user3 = req.body.user3;

  const newTestuser = new TestUser({
    id,
    pos,
    action,
    delay,
    user1,
    user2,
    user3,
  });

  newTestuser
    .save()
    .then(() => res.json("Test User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router; //standard code for exporting router
