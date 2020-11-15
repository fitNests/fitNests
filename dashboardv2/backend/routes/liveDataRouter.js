const router = require("express").Router();
//const Testuser = require('../models/testuser.model');
let LiveData = require("../models/liveData.models");

//USED to handle CRUD Operations
//first endpoint that handles http get request
router.route("/").get((req, res) => {
  LiveData.find()
    .then((testUser) => res.json(testUser)) //returns user in json format
    .catch((err) => res.status(400).json("Error: " + err));
});

//Whenever theres an add prefix it stores it inside the mongodb Database
router.route("/add").post((req, res) => {
  const id = req.body.id;
  const type = req.body.type;
  const pos = req.body.pos;
  const expectedPos = req.body.expectedPos;
  const user1action = req.body.user1action;
  const user2action = req.body.user2action;
  const user3action = req.body.user3action;
  const delay = req.body.delay;
  const user1features = req.body.user1features;
  const user2features = req.body.user2features;
  const user3features = req.body.user3features;

  const newLiveData = new LiveData({
    id,
    type,
    pos,
    expectedPos,
    user1action,
    user2action,
    user3action,
    delay,
    user1features,
    user2features,
    user3features,
  });

  newLiveData
    .save()
    .then(() => res.json("Live Data added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router; //standard code for exporting router
