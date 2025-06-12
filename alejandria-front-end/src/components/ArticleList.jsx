import React from 'react';
import { Link } from 'react-router-dom';

function ArticleList({ articles }) {
  // Handle empty articles array
  if (!articles || articles.length === 0) {
    return (
      <div className="article-list" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>No articles available yet.</p>
        <p style={{ color: '#999' }}>Check back soon for new content!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': '#2196F3',
      'Programming': '#4CAF50',
      'Design': '#FF9800',
      'Backend': '#9C27B0',
      'Frontend': '#00BCD4',
      'DevOps': '#FF5722'
    };
    return colors[category] || '#757575';
  };

  return (
    <div className="article-list" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      padding: '1rem'
    }}>
      {articles.map((article) => (
        <div 
          key={article.id || article.name} 
          className="article-card"
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
          }}
        >
          {/* Article Image */}
          {article.image && (
            <div style={{ height: '180px', overflow: 'hidden' }}>
              <img
                src={article.image}
                alt={article.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div style={{ padding: '1.25rem' }}>
            {/* Category and Date */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem'
            }}>
              {article.category && (
                <span style={{
                  backgroundColor: getCategoryColor(article.category),
                  color: 'white',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {article.category}
                </span>
              )}
              {article.publishDate && (
                <span style={{
                  color: '#999',
                  fontSize: '0.85rem'
                }}>
                  {formatDate(article.publishDate)}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              margin: '0 0 0.5rem 0',
              color: '#333',
              lineHeight: '1.3'
            }}>
              <Link
                to={`/articles/${article.name}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                {article.title}
              </Link>
            </h3>

            {/* Description */}
            <p style={{
              color: '#666',
              lineHeight: '1.5',
              marginBottom: '1rem',
              fontSize: '0.95rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {article.description}
            </p>

            {/* Footer with Author, Views, and Read More */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '0.75rem',
              borderTop: '1px solid #eee'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                {article.author && <span>By {article.author}</span>}
                {article.views !== undefined && (
                  <span style={{ marginLeft: '0.5rem' }}>
                    • {article.views?.toLocaleString()} views
                  </span>
                )}
              </div>
              
              <Link 
                to={`/articles/${article.name}`}
                style={{
                  color: '#61dafb',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f0f8ff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Read More →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ArticleList;