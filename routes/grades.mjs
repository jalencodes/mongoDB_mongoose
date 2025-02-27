import express from "express";
import Grades from '../models/Grades.mjs'


const router = express.Router();

// Create a single grade entry
router.post("/", async (req, res) => {
  const newGrade = req.body
  if(req.body.student_id){
    newGrade.learner_id = newGrade.student_id
    delete newGrade.student_id
  }

  try { 
    const grade = await Grades.create(req.body)
    res.send(grade).status(204)
  } catch (error) {
    res.send({error: 'Error, invalid data'}).status(404)
  }

});

// Get a single grade entry
router.get("/:id", async (req, res) => {
  try {
    const grades = await Grades.findById(req.params.id)
    console.log(grades);
    res.send(grades).status(200)
  } catch (error) {
      console.log(error);
      res.send({error: 'Error, invalid data'}).status(404)
  }


});

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {
  try {
    const grade = await Grades.findById(req.params.id)
    grade.scores.push(req.body)
    grade.save()
    res.send(grade)
  } catch (error) {
    res.send({error: 'Error, invalid data'}).status(404)
  }

});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {

  try {
    const grade = await Grades.findById(req.params.id)
    grade.scores.pull(req.body)
    grade.save()
    res.send(grade)
  } catch (error) {
    res.send({error: 'Error, invalid data'}).status(404)
  }
});

// Delete a single grade entry
router.delete("/:id", async (req, res) => {
  try{
    const deletedGrade = await Grades.findByIdAndDelete(req.params.id)

    res.send({
        deletedGrade: deletedGrade,
        messsage: 'Grade deleted'
    })
  } catch(error) {
      console.log(error);
      res.send({error: 'Error, invalid data'}).status(404)
  }
});

// Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {
  res.redirect(`learner/${req.params.id}`);
});

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  
  try {
    const query = { learner_id: req.params.id }
    const learner = await Grades.find(query)
    res.send(learner).status(200)
  } catch (error) {
    res.send({error: 'Error, invalid data'}).status(404)
  }
});

// Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
  try {
    const query = { learner_id: req.params.id }
    const learner = await Grades.deleteOne(query)
    res.send(learner).status(200)
  } catch (error) {
    res.send({error: 'Error, invalid data'}).status(404)
  }
});

// Get a class's grade data
router.get("/class/:id", async (req, res) => {
  try {
    const query = { class_id: req.params.id }
    const classGrades = await Grades.find(query)
    res.send(classGrades).status(200)
  } catch (error) {
    res.send({error: 'Error, invalid data'}).status(404)
  }
});

// Update a class id
router.patch("/class/:id", async (req, res) => {

  try {
    const newClassId = req.body.class_id
    if (classFound) res.send("Class ID  already exists").status(400)
    const query = { class_id: req.params.id }
    const newClass = Grades.update(query, { $set: { class_id: newClassId }})
    res.send(newClass)

  } catch (error) {
    res.send({error: 'Error, invalid data'}).status(404)
  }


  // let collection = await db.collection("grades");
  // let query = { class_id: Number(req.params.id) };

  // let result = await collection.updateMany(query, {
  //   $set: { class_id: req.body.class_id },
  // });

  // if (!result) res.send("Not found").status(404);
  // else res.send(result).status(200);
});

// Delete a class
router.delete("/class/:id", async (req, res) => {
  let collection = await db.collection("grades");
  let query = { class_id: Number(req.params.id) };

  let result = await collection.deleteMany(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;
