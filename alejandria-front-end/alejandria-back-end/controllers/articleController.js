const Article = require('../models/Article');

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    console.log('Fetching all articles...');
    const articles = await Article.find().sort({ createdAt: -1 }); // Sort by newest first
    console.log('Fetched:', articles.length, 'articles');
    res.json(articles);
  } catch (err) {
    console.error('❌ Error in getAllArticles:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get published articles
exports.getPublishedArticles = async (req, res) => {
  try {
    console.log('🔍 Fetching published articles...');
    
    // First, let's see all articles and their statuses
    const allArticles = await Article.find();
    console.log('📊 All articles with statuses:');
    allArticles.forEach(article => {
      console.log(`- "${article.title}": status = "${article.status}" (type: ${typeof article.status})`);
    });
    
    // Now try to find published ones
    const publishedArticles = await Article.find({ status: 'Published' }).sort({ createdAt: -1 });
    console.log(`✅ Found ${publishedArticles.length} published articles`);
    
    res.json(publishedArticles);
  } catch (err) {
    console.error('❌ Error in getPublishedArticles:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get article by ID
exports.getArticleById = async (req, res) => {
  try {
    console.log('Fetching article by ID:', req.params.id);
    const article = await Article.findById(req.params.id);
    if (!article) {
      console.log('Article not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Article not found' });
    }
    console.log('Found article:', article.title);
    res.json(article);
  } catch (err) {
    console.error('❌ Error in getArticleById:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get article by name
exports.getArticleByName = async (req, res) => {
  try {
    console.log('Fetching article by name:', req.params.name);
    const article = await Article.findOne({ name: req.params.name });
    if (!article) {
      console.log('Article not found with name:', req.params.name);
      return res.status(404).json({ message: 'Article not found' });
    }
    console.log('Found article:', article.title);
    res.json(article);
  } catch (err) {
    console.error('❌ Error in getArticleByName:', err);
    res.status(500).json({ message: err.message });
  }
};

// Add new article
exports.addArticle = async (req, res) => {
  try {
    console.log('Creating new article:', req.body.title);
    
    // Validate required fields
    const { title, description, category, author } = req.body;
    if (!title || !description || !category || !author) {
      return res.status(400).json({ 
        message: 'Missing required fields: title, description, category, and author are required' 
      });
    }

    const article = new Article(req.body);
    const saved = await article.save();
    console.log('Article created successfully:', saved.title, 'with name:', saved.name);
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error in addArticle:', err);
    
    // Handle duplicate name error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
      return res.status(400).json({ 
        message: 'An article with this title already exists. Please use a different title.' 
      });
    }
    
    res.status(400).json({ message: err.message });
  }
};

// Update article
exports.updateArticle = async (req, res) => {
  try {
    console.log('Updating article with ID:', req.params.id);
    
    const updated = await Article.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true, // Run validation on update
      }
    );
    
    if (!updated) {
      console.log('Article not found for update with ID:', req.params.id);
      return res.status(404).json({ message: 'Article not found' });
    }
    
    console.log('Article updated successfully:', updated.title);
    res.json(updated);
  } catch (err) {
    console.error('❌ Error in updateArticle:', err);
    
    // Handle duplicate name error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.name) {
      return res.status(400).json({ 
        message: 'An article with this title already exists. Please use a different title.' 
      });
    }
    
    res.status(400).json({ message: err.message });
  }
};

// Delete article
exports.deleteArticle = async (req, res) => {
  try {
    console.log('Deleting article with ID:', req.params.id);
    
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.log('Article not found for deletion with ID:', req.params.id);
      return res.status(404).json({ message: 'Article not found' });
    }
    
    console.log('Article deleted successfully:', deleted.title);
    res.json({ message: 'Article deleted successfully', deletedArticle: deleted });
  } catch (err) {
    console.error('❌ Error in deleteArticle:', err);
    res.status(500).json({ message: err.message });
  }
};

// Increment views
exports.incrementArticleViews = async (req, res) => {
  try {
    console.log('Incrementing views for article:', req.params.name);
    
    const article = await Article.findOneAndUpdate(
      { name: req.params.name },
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!article) {
      console.log('Article not found for view increment:', req.params.name);
      return res.status(404).json({ message: 'Article not found' });
    }
    
    console.log('Views incremented for:', article.title, 'New view count:', article.views);
    res.json({ message: 'Views incremented', views: article.views });
  } catch (err) {
    console.error('❌ Error in incrementArticleViews:', err);
    res.status(500).json({ message: err.message });
  }
};

// Search articles by title, description, or content
exports.searchArticles = async (req, res) => {
  try {
    const query = req.query.q;
    console.log('Searching articles with query:', query);
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const results = await Article.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        // Search in content array - this searches in the paragraph field of content objects
        { 'content.paragraph': { $regex: query, $options: 'i' } },
        { 'content.heading': { $regex: query, $options: 'i' } }
      ],
    }).sort({ createdAt: -1 });
    
    console.log('Search found:', results.length, 'articles');
    res.json(results);
  } catch (err) {
    console.error('❌ Error in searchArticles:', err);
    res.status(500).json({ message: err.message });
  }
};