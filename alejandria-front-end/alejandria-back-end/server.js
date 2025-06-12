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
app.use(cors());

// Fix CORS errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes); // ✅ Added this line

// Serve Frontend (for production build)
if (process.env.NODE_ENV === "production") {
  const root = path.join(__dirname, '../robles-front-end/dist');
  app.use(express.static(root));
  app.all('/*any', (req, res, next) => {
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
