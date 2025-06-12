import React, { useState, useEffect } from 'react';
import ArticleList from '../../components/ArticleList';
import articleService from '../../services/ArticleService'; 

function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching articles from API...');
     
      const publishedArticles = await articleService.getPublishedArticles();
      console.log('Fetched articles:', publishedArticles);
      setArticles(publishedArticles);
    } catch (error) {
      console.error('Error loading articles:', error);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Articles</h1>
        <p>Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Articles</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={loadArticles} style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: '#61dafb', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Articles</h1>
        <button 
          onClick={loadArticles}
          style={{
            backgroundColor: '#61dafb',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          🔄 Refresh
        </button>
      </div>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        {articles.length} published article{articles.length !== 1 ? 's' : ''}
      </p>
      <ArticleList articles={articles} />
    </div>
  );
}

export default ArticleListPage;
