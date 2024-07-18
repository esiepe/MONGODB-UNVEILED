require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MongoDB connection
const connectionString = process.env.MONGO_URI;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String
});

const Student = mongoose.model('Student', studentSchema);

// Create
app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read (all students)
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find({});
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read (single student)
app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send();
    }
    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update
app.patch('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).send();
    }
    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete
app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).send();
    }
    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Find all students with a grade of "A"
app.get('/students/grade/A', async (req, res) => {
  try {
    const students = await Student.find({ grade: "A" });
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Find students aged 20 and above
app.get('/students/age/20plus', async (req, res) => {
  try {
    const students = await Student.find({ age: { $gte: 20 } });
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Sort students by name in descending order
app.get('/students/sorted', async (req, res) => {
  try {
    const students = await Student.find().sort({ name: -1 });
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update all students' grades to "B"
app.put('/students/updateall', async (req, res) => {
  try {
    const result = await Student.updateMany({}, { $set: { grade: "B" } });
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete all students with a grade of "F"
app.delete('/students/deletefail', async (req, res) => {
  try {
    const result = await Student.deleteMany({ grade: "F" });
    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));