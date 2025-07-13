require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch(err => console.error("❌ DB error:", err));

const studentSchema = new mongoose.Schema({
  name: String,
  branch: String
});
const Student = mongoose.model('Student', studentSchema);

app.post('/add', async (req, res) => {
  try {
    const { name, branch } = req.body;
    const student = new Student({ name, branch });
    await student.save();
    res.status(201).json({ message: "✅ Student added", student });
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to add student" });
  }
});

app.get('/all', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "❌ Failed to retrieve students" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});