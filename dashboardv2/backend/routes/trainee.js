const router = require("express").Router();
let Trainee = require("../models/trainee.model");

router.route("/").get((req, res) => {
  console.log("GETTING THEM BREAD");
  Trainee.find()
    .then((trainee) => console.log(res.json(trainee)))
    .catch((err) => res.status(400).json("Error: " + err));
});
router.route("/:id").get((req, res) => {
  Trainee.findById(req.params.id)
    .then((trainee) => res.json(trainee))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Trainee.findByIdAndDelete(req.params.id)
    .then(() => res.json("Trainee deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Modify Existing details

router.route("/update/:id").post((req, res) => {
  Trainee.findById(req.params.id) //find the current exercise
    .then((trainee) => {
      trainee.name = req.body.name;
      trainee.email = req.body.email;
      trainee.age = Number(req.body.age);
      trainee.address = req.body.address;
      trainee.gender = req.body.gender;
      trainee.plan = req.body.plan;

      trainee
        .save()
        .then(() => res.json("Trainee Details updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const age = Number(req.body.age);
  const address = req.body.address;
  const gender = req.body.gender;
  const plan = req.body.plan;

  const newTrainee = new Trainee({
    name,
    email,
    age,
    address,
    gender,
    plan,
  });

  newTrainee
    .save()
    .then(() => res.json("New Trainee Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
