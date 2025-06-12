require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5175',
    'https://alejandria-frontend3.onrender.com'
  ],
  credentials: true
}));

// API Routes only
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server working!', timestamp: new Date() });
});

try {
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);
} catch (error) {
  console.error('❌ Error loading user routes:', error.message);
}

try {
  const articleRoutes = require('./routes/articleRoutes');
  app.use('/api/articles', articleRoutes);
} catch (error) {
  console.error('❌ Error loading article routes:', error.message);
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});