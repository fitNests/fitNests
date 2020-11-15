const router = require("express").Router();
let Exercise = require("../models/exercise.model");

//USED to handle CRUD Operations
router.route("/").get((req, res) => {
  Exercise.find()
    .then((exercise) => res.json(exercise)) //returns user in json format
    .catch((err) => res.status(400).json("Error: " + err));
});

//Whenever theres an add prefix it stores it inside the mongodb Database
router.route("/add").post((req, res) => {
  const exerciseTally = req.body.exerciseTally;

  const newExercise = new Exercise({
    exerciseTally,
  });

  newExercise
    .save()
    .then(() => res.json("Exercise added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//update the details using the parameter to store within the id
router.route("/update/:id").post((req, res) => {
  Exercise.findById(req.params.id) //find the current exercise
    .then((exercise) => {
      exercise.exerciseTally = req.body.exerciseTally;
      exercise
        .save()
        .then(() => res.json("Exercise updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Exercise.findByIdAndDelete(req.params.id)
    .then(() => res.json("Exercise deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
