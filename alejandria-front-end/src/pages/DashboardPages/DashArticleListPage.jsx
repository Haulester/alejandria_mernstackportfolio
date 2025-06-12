import React, { useState, useEffect } from 'react';
import articleService from '../../services/ArticleService';

const DashArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'add', // 'add' or 'edit'
    article: null
  });

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    status: 'Draft',
    description: '',
    publishDate: ''
  });

  // Load articles on component mount
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    setError('');
    try {
      // Get all articles from the backend service
      const articlesData = await articleService.getAllArticles();
      setArticles(articlesData);
    } catch (error) {
      console.error('Error loading articles:', error);
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddArticle = () => {
    setModalState({
      isOpen: true,
      mode: 'add',
      article: null
    });
    setFormData({
      title: '',
      author: '',
      category: '',
      status: 'Draft',
      description: '',
      publishDate: ''
    });
  };

  const handleEditArticle = (article) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      article: article
    });
    setFormData({
      title: article.title,
      author: article.author,
      category: article.category,
      status: article.status,
      description: article.description,
      publishDate: article.publishDate
    });
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await articleService.deleteArticle(id);
        await loadArticles(); // Refresh the list
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Error deleting article. Please try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: 'add',
      article: null
    });
    setError('');
  };

  const handleSaveArticle = async (event) => {
    event.preventDefault();
    setError('');
    
    try {
      if (modalState.mode === 'add') {
        await articleService.addArticle({
          ...formData,
          publishDate: formData.publishDate || new Date().toISOString().split('T')[0]
        });
      } else {
        await articleService.updateArticle(modalState.article.id, formData);
      }
      
      await loadArticles(); // Refresh the list
      handleCloseModal();
    } catch (error) {
      console.error('Error saving article:', error);
      setError(error.message || 'Error saving article. Please try again.');
    }
  };

  if (error && !modalState.isOpen) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#dc3545' }}>Error</h2>
        <p>{error}</p>
        <button
          onClick={loadArticles}
          style={{
            backgroundColor: '#61dafb',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            margin: '0 0 0.5rem 0',
            color: '#333'
          }}>
            Article Management
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            Manage your articles, drafts, and publications
          </p>
        </div>
        
        <button
          onClick={handleAddArticle}
          style={{
            backgroundColor: '#61dafb',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#21a1f1'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#61dafb'}
        >
          + Add Article
        </button>
      </div>

      {/* Articles Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center',
            color: '#666'
          }}>
            Loading articles...
          </div>
        ) : articles.length === 0 ? (
          <div style={{ 
            padding: '3rem', 
            textAlign: 'center',
            color: '#666'
          }}>
            <p>No articles found.</p>
            <button
              onClick={handleAddArticle}
              style={{
                backgroundColor: '#61dafb',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              Create Your First Article
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse'
            }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Title</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Author</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Views</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                          {article.title}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                          URL: /article/{article.name}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#666' }}>
                          {article.description}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>{article.author}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        {article.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        backgroundColor: article.status === 'Published' ? '#e8f5e8' : 
                                       article.status === 'Draft' ? '#fff3cd' : '#f8d7da',
                        color: article.status === 'Published' ? '#2e7d32' : 
                               article.status === 'Draft' ? '#856404' : '#721c24',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        {article.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{article.publishDate}</td>
                    <td style={{ padding: '1rem' }}>{article.views?.toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEditArticle(article)}
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <a
                          href={`/articles/${article.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            display: 'inline-block'
                          }}
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalState.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
              {modalState.mode === 'add' ? 'Add New Article' : 'Edit Article'}
            </h2>
            
            {error && (
              <div style={{
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '0.75rem',
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSaveArticle}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Author *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Backend">Backend</option>
                    <option value="Frontend">Frontend</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Publish Date
                </label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({...formData, publishDate: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #ddd',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#61dafb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {modalState.mode === 'add' ? 'Add Article' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashArticleListPage;