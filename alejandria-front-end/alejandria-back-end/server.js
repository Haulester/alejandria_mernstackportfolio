require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const connectDB = require('./config/db');

// Routes
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes'); 

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));

// Updated CORS for production
app.use(cors({
  origin: [
    'http://localhost:5175',
    'https://alejandria-frontend3.onrender.com' // Your frontend URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

// Serve Frontend (for production build) - UPDATED PATH
if (process.env.NODE_ENV === "production") {
  const root = path.join(__dirname, '../dist'); // Fixed path for your structure
  app.use(express.static(root));
  app.get('*', (req, res) => { // Fixed from app.all to app.get
    res.sendFile(path.join(root, 'index.html'));
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));