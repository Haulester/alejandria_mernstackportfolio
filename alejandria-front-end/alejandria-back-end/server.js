require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const connectDB = require('./config/db');

// Routes - COMMENTED OUT FOR DEBUGGING
// const userRoutes = require('./routes/userRoutes');
// const articleRoutes = require('./routes/articleRoutes'); 

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5175',
    'https://alejandria-frontend3.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// API Routes - COMMENTED OUT FOR DEBUGGING
// app.use('/api/users', userRoutes);
// app.use('/api/articles', articleRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Serve Frontend (for production build)
if (process.env.NODE_ENV === "production") {
  const root = path.join(__dirname, '../dist');
  app.use(express.static(root));
  app.get('*', (req, res) => {
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