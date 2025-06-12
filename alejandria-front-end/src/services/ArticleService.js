const API_BASE_URL = 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL); // For debugging

const articleService = {
  // Get all articles
  async getAllArticles() {
    try {
      const response = await fetch(`${API_BASE_URL}/articles`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const articles = await response.json();
      
      // Transform backend data to match frontend expectations
      return articles.map(article => ({
        id: article._id,
        name: article.name,
        title: article.title,
        author: article.author,
        category: article.category,
        status: article.status,
        description: article.description,
        publishDate: article.createdAt ? new Date(article.createdAt).toISOString().split('T')[0] : '',
        views: article.views || 0,
        content: article.content || [],
        image: article.image || null
      }));
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  // Get published articles only
  async getPublishedArticles() {
    try {
      // Use the working /articles endpoint and filter published ones
      const response = await fetch(`${API_BASE_URL}/articles`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const allArticles = await response.json();
      
      // Filter only published articles on the frontend
      const publishedArticles = allArticles.filter(article => article.status === 'Published');
      
      return publishedArticles.map(article => ({
        id: article._id,
        name: article.name,
        title: article.title,
        author: article.author,
        category: article.category,
        status: article.status,
        description: article.description,
        publishDate: article.createdAt ? new Date(article.createdAt).toISOString().split('T')[0] : '',
        views: article.views || 0,
        content: article.content || [],
        image: article.image || null
      }));
    } catch (error) {
      console.error('Error fetching published articles:', error);
      throw error;
    }
  },

  // Get article by name
  async getArticleByName(name) {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/name/${name}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const article = await response.json();
      
      return {
        id: article._id,
        name: article.name,
        title: article.title,
        author: article.author,
        category: article.category,
        status: article.status,
        description: article.description,
        publishDate: article.createdAt ? new Date(article.createdAt).toISOString().split('T')[0] : '',
        views: article.views || 0,
        content: article.content || [],
        image: article.image || null
      };
    } catch (error) {
      console.error('Error fetching article by name:', error);
      throw error;
    }
  },

  // Add new article
  async addArticle(articleData) {
    try {
      // Transform frontend data to match backend expectations
      const backendData = {
        title: articleData.title,
        description: articleData.description,
        category: articleData.category,
        author: articleData.author,
        status: articleData.status,
        content: articleData.content || [],
        image: articleData.image || null
      };

      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const savedArticle = await response.json();
      
      return {
        id: savedArticle._id,
        name: savedArticle.name,
        title: savedArticle.title,
        author: savedArticle.author,
        category: savedArticle.category,
        status: savedArticle.status,
        description: savedArticle.description,
        publishDate: savedArticle.createdAt ? new Date(savedArticle.createdAt).toISOString().split('T')[0] : '',
        views: savedArticle.views || 0,
        content: savedArticle.content || [],
        image: savedArticle.image || null
      };
    } catch (error) {
      console.error('Error adding article:', error);
      throw error;
    }
  },

  // Update article
  async updateArticle(id, articleData) {
    try {
      // Transform frontend data to match backend expectations
      const backendData = {
        title: articleData.title,
        description: articleData.description,
        category: articleData.category,
        author: articleData.author,
        status: articleData.status,
        content: articleData.content || [],
        image: articleData.image || null
      };

      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedArticle = await response.json();
      
      return {
        id: updatedArticle._id,
        name: updatedArticle.name,
        title: updatedArticle.title,
        author: updatedArticle.author,
        category: updatedArticle.category,
        status: updatedArticle.status,
        description: updatedArticle.description,
        publishDate: updatedArticle.createdAt ? new Date(updatedArticle.createdAt).toISOString().split('T')[0] : '',
        views: updatedArticle.views || 0,
        content: updatedArticle.content || [],
        image: updatedArticle.image || null
      };
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  },

  // Delete article
  async deleteArticle(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  },

  // Increment article views
  async incrementViews(name) {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/increment-views/${name}`, {
        method: 'POST',
      });

      if (!response.ok) {
        console.warn(`Failed to increment views for article: ${name}`);
        return;
      }

      return await response.json();
    } catch (error) {
      console.warn('Error incrementing views:', error);
      // Don't throw error for view increment failures
    }
  },

  // Search articles
  async searchArticles(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const articles = await response.json();
      
      return articles.map(article => ({
        id: article._id,
        name: article.name,
        title: article.title,
        author: article.author,
        category: article.category,
        status: article.status,
        description: article.description,
        publishDate: article.createdAt ? new Date(article.createdAt).toISOString().split('T')[0] : '',
        views: article.views || 0,
        content: article.content || [],
        image: article.image || null
      }));
    } catch (error) {
      console.error('Error searching articles:', error);
      throw error;
    }
  }
};

export default articleService;