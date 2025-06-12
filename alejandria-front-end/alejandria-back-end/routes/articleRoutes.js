const express = require('express');
const {
  getAllArticles,
  getPublishedArticles,
  getArticleById,
  getArticleByName,
  addArticle,
  updateArticle,
  deleteArticle,
  incrementArticleViews,
  searchArticles
} = require('../controllers/articleController');

const router = express.Router();

// Test route (keep for debugging)
router.get('/test', (req, res) => {
  res.json({ message: 'Article routes working!' });
});

// Specific routes FIRST (before parameterized routes)
router.get('/', getAllArticles);
router.get('/published', getPublishedArticles);
router.get('/search', searchArticles);

// Parameterized routes LAST
router.get('/name/:name', getArticleByName);
router.get('/:id', getArticleById);

// POST/PUT/DELETE routes
router.post('/', addArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);
router.post('/increment-views/:name', incrementArticleViews);

module.exports = router;