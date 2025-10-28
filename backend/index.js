require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { signUp, signIn } = require('./auth');

const app = express();
const port = process.env.PORT || 5000;

// Environment variable checks
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
  console.error('FATAL ERROR: MONGODB_URI is not defined.');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

// Allow all origins for CORS.
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const challenges = require('./challenges');
const gradeInsights = require('./gradeInsights');
const { updateSimulation, setIntensity, calculateGrade } = require('./simulationEngine');

const simulations = {};

  app.get('/', (req, res) => {
    res.send('Hello from the backend!');
  });

  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      const { token, userId } = await signUp(email, password);
      res.status(201).json({ token, userId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  const authMiddleware = require('./middleware/authMiddleware');
const SimulationResult = require('./models/SimulationResult');

  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      const { token, userId } = await signIn(email, password);
      res.json({ token, userId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post('/api/results', authMiddleware, async (req, res) => {
    try {
      const { challenge, timeAchieved, grade } = req.body;
      const result = new SimulationResult({
        userId: req.user._id,
        challenge,
        timeAchieved,
        grade,
      });
      await result.save();
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get('/api/results', authMiddleware, async (req, res) => {
    try {
      const results = await SimulationResult.find({ userId: req.user._id }).sort({ timestamp: -1 });
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/challenges', (req, res) => {
    res.json(challenges);
  });

  app.get('/api/grade-insights', (req, res) => {
    res.json(gradeInsights);
  });

  app.post('/api/simulation/start', (req, res) => {
    const simulationId = Date.now().toString();
  const initialState = {
      currentHeartRate: 70,
      targetHeartRate: 70,
      intensity: 'rest',
      zone: 'resting',
      history: [70],
      heartRateVelocity: 0,
    };
    simulations[simulationId] = initialState;
    res.json({ simulationId, initialState });
  });

  app.post('/api/simulation/challenge', (req, res) => {
    const { simulationId, challenge } = req.body;
    let state = simulations[simulationId];

    if (!state) {
      return res.status(404).json({ message: 'Simulation not found' });
    }

    state.challenge = challenge;
    state.timeInZone = 0;
    state.elapsedTime = 0;
    state.grade = null;
    state.completed = false;

    simulations[simulationId] = state;

    res.json(state);
  });

  app.post('/api/simulation/update', (req, res) => {
    const { simulationId, intensity, deltaTime } = req.body;
    let state = simulations[simulationId];

    if (!state) {
      return res.status(404).json({ message: 'Simulation not found' });
    }

    if (intensity) {
      state = setIntensity(state, intensity);
    }

    state = updateSimulation(state, deltaTime);

    if (!state.history) {
      state.history = [];
    }
    state.history.push(state.currentHeartRate);
    if (state.history.length > 150) {
      state.history.shift();
    }

    if (state.challenge) {
      state.elapsedTime += deltaTime / 1000;
      if (state.zone === state.challenge.targetZone) {
        state.timeInZone += deltaTime / 1000;
      }

      if (state.elapsedTime >= state.challenge.totalDuration) {
        const grade = calculateGrade(state.timeInZone, state.challenge.goalDuration);
        state.grade = grade;
        state.completed = true;
      }
    }

    simulations[simulationId] = state;

    res.json(state);
  });

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
