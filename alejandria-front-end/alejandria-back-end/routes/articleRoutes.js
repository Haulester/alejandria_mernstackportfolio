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


router.get('/', getAllArticles);
router.get('/published', getPublishedArticles);
router.get('/search', searchArticles);


router.get('/debug-published', async (req, res) => {
  try {
    const Article = require('../models/Article');
    
    console.log('🔍 Debug route called');
    
    // Get all articles
    const all = await Article.find();
    console.log(`📊 Total articles in DB: ${all.length}`);
    
    // Get published articles
    const published = await Article.find({ status: 'Published' });
    console.log(`✅ Published articles found: ${published.length}`);
    
    // Log each article's status for debugging
    all.forEach(article => {
      console.log(`- "${article.title}": status = "${article.status}" (type: ${typeof article.status})`);
    });
    
    res.json({
      total: all.length,
      published: published.length,
      allStatuses: all.map(a => ({ 
        title: a.title, 
        status: a.status, 
        statusType: typeof a.status,
        statusLength: a.status ? a.status.length : 'null'
      })),
      publishedTitles: published.map(a => a.title)
    });
  } catch (error) {
    console.error('❌ Debug route error:', error);
    res.json({ error: error.message });
  }
});

// Put parameterized routes AFTER specific routes
router.get('/name/:name', getArticleByName);
router.get('/:id', getArticleById);

router.post('/', addArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);
router.post('/increment-views/:name', incrementArticleViews);

module.exports = router;