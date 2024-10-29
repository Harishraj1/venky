// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the app
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (without .env for the URI)
mongoose.connect('mongodb://localhost:27017/hr_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define the Candidate schema and model
const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, default: '' },
  round: { type: String, default: '' },
});

const Candidate = mongoose.model('Candidate', candidateSchema);

// Route to fetch all candidates
app.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).send('Error fetching candidates');
  }
});

// Route to update candidate feedback
app.put('/api/candidates/:id', async (req, res) => {
  try {
    const { status, round } = req.body;
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status, round },
      { new: true }
    );
    res.json(updatedCandidate);
  } catch (err) {
    res.status(500).send('Error updating feedback');
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
