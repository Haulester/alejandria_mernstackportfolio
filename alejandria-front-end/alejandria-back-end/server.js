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

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server working!', timestamp: new Date() });
});

// Add routes one by one
try {
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);
  console.log('✅ User routes loaded');
} catch (error) {
  console.error('❌ Error loading user routes:', error.message);
}

try {
  const articleRoutes = require('./routes/articleRoutes');
  app.use('/api/articles', articleRoutes);
  console.log('✅ Article routes loaded');
} catch (error) {
  console.error('❌ Error loading article routes:', error.message);
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
});