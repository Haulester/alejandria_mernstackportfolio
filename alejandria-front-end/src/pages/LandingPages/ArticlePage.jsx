import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import articleService from '../../services/ArticleService';
import '../../styles/ArticlePage.css';  

function ArticlePage() {
  const { name } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Get article by name from the backend service
        const foundArticle = await articleService.getArticleByName(name);
        
        if (foundArticle) {
          // Only show published articles to public users
          if (foundArticle.status === 'Published') {
            setArticle(foundArticle);
            // Increment view count (don't wait for it to complete)
            articleService.incrementViews(name).catch(err => {
              console.warn('Failed to increment views:', err);
            });
          } else {
            setArticle(null);
            setError('This article is not published yet.');
          }
        } else {
          setArticle(null);
          setError('Article not found.');
        }
      } catch (error) {
        console.error('Error loading article:', error);
        setArticle(null);
        setError('Failed to load article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      loadArticle();
    }
  }, [name]);

  if (loading) {
    return (
      <div className="article-page" style={{ 
        textAlign: 'center', 
        padding: '2rem',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ 
            fontSize: '1.2rem', 
            color: '#666',
            marginBottom: '1rem'
          }}>
            Loading article...
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #61dafb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-page" style={{ 
        textAlign: 'center', 
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1 style={{ color: '#dc3545', marginBottom: '1rem' }}>
          {error || 'Article not found'}
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          {error || "The article you're looking for doesn't exist or is not published yet."}
        </p>
        <a 
          href="/articles" 
          style={{ 
            color: '#61dafb', 
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}
        >
          ← Back to Articles
        </a>
      </div>
    );
  }

  return (
    <div className="article-page" style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem' 
    }}>
      {/* Article metadata */}
      <div className="article-meta" style={{ 
        marginBottom: '2rem', 
        padding: '1rem', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ 
              backgroundColor: '#e3f2fd', 
              color: '#1976d2', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '4px',
              fontSize: '0.875rem',
              marginRight: '1rem'
            }}>
              {article.category}
            </span>
            <span style={{ color: '#666', fontSize: '0.875rem' }}>
              By {article.author} • {article.publishDate}
            </span>
          </div>
          <div style={{ color: '#666', fontSize: '0.875rem' }}>
            {article.views?.toLocaleString()} views
          </div>
        </div>
      </div>

      {/* Article title */}
      <h1 style={{ 
        fontSize: '2.5rem',
        fontWeight: '700',
        lineHeight: '1.2',
        marginBottom: '1.5rem',
        color: '#333'
      }}>
        {article.title}
      </h1>

      {/* Displaying the article's image */}
      {article.image && (
        <img 
          src={article.image} 
          alt={article.title} 
          className="article-image"
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            marginBottom: '2rem',
            objectFit: 'cover'
          }}
        />
      )}
      
      {/* Show description if available */}
      {article.description && (
        <div style={{ 
          fontSize: '1.2rem', 
          color: '#666', 
          fontStyle: 'italic',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderLeft: '4px solid #61dafb',
          borderRadius: '0 4px 4px 0'
        }}>
          {article.description}
        </div>
      )}

      {/* Display the article's content */}
      <div className="article-content" style={{ 
        lineHeight: '1.8',
        fontSize: '1.1rem',
        color: '#333'
      }}>
        {article.content && article.content.length > 0 ? (
          article.content.map((contentItem, index) => (
            <div key={index} style={{ marginBottom: '1.5rem' }}>
              {/* If content has heading, show it */}
              {contentItem.heading && (
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#333'
                }}>
                  {contentItem.heading}
                </h2>
              )}
              {/* Show paragraph content */}
              {contentItem.paragraph && (
                <p style={{ marginBottom: '1rem' }}>
                  {contentItem.paragraph}
                </p>
              )}
              {/* If content is just a string (for backward compatibility) */}
              {typeof contentItem === 'string' && (
                <p style={{ marginBottom: '1rem' }}>
                  {contentItem}
                </p>
              )}
            </div>
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 2rem',
            color: '#666',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '2px dashed #ddd'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📝</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              This article is still being written.
            </p>
            <p style={{ fontSize: '0.9rem', color: '#999' }}>
              Check back soon for the full content!
            </p>
          </div>
        )}
      </div>

      {/* Article footer with navigation */}
      <div className="article-footer" style={{ 
        marginTop: '3rem', 
        padding: '2rem 0',
        borderTop: '1px solid #e9ecef'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <a 
            href="/articles" 
            style={{ 
              color: '#61dafb', 
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ← Back to All Articles
          </a>
        </div>
        
        {/* Article metadata footer */}
        <div style={{ 
          textAlign: 'center',
          color: '#999',
          fontSize: '0.875rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          <div>Article ID: {article.name}</div>
          <div>Last updated: {article.publishDate}</div>
          {article.views > 0 && (
            <div>Total views: {article.views.toLocaleString()}</div>
          )}
        </div>
      </div>

      {/* Add some CSS for the loading animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ArticlePage;