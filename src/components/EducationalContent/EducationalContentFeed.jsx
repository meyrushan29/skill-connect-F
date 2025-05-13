import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Form, Button } from 'react-bootstrap';
import { BookOpen, BookmarkPlus, BookmarkCheck, CheckCircle, 
         Check, Edit, Trash2, Eye, Loader, Search } from 'lucide-react';
import MultiPDFViewer from './MultiPDFViewer';
import './EducationalContent.css';

const EducationalContentFeed = ({ userId }) => {
  const [contentFeed, setContentFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('following');
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedPDFContent, setSelectedPDFContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContent, setFilteredContent] = useState([]);
  
  // States for updating content
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [contentToUpdate, setContentToUpdate] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  const [updatedTags, setUpdatedTags] = useState('');
  
  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);

  const token = localStorage.getItem("psnToken");

  const fetchContent = async (endpoint) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `/api/v1/educational/${endpoint}`,
        { id: userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      
      if (response.data.status === 'success') {
        setContentFeed(response.data.payload);
        setFilteredContent(response.data.payload);
      } else {
        setError(response.data.message || 'Failed to fetch content');
        setContentFeed([]);
        setFilteredContent([]);
      }
    } catch (error) {
      setError('Failed to fetch content');
      setContentFeed([]);
      setFilteredContent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab, userId]);

  // Filter content based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredContent(contentFeed);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = contentFeed.filter(item => {
      const content = activeTab === 'following' ? item.content : item;
      
      // Search in title, description, and tags
      return (
        content.title.toLowerCase().includes(query) ||
        content.description.toLowerCase().includes(query) ||
        (content.tags && content.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    });
    
    setFilteredContent(filtered);
  }, [searchQuery, contentFeed, activeTab]);

  const handleMarkAsLearned = async (contentId) => {
    try {
      const response = await axios.post(
        '/api/v1/educational/mark-learned',
        { contentId, userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status === 'success') {
        setContentFeed(prevFeed => {
          const updatedFeed = [...prevFeed];
          if (Array.isArray(updatedFeed)) {
            if (activeTab === 'following') {
              return updatedFeed.map(item => {
                if (item.content.id === contentId) {
                  const updatedContent = { ...item.content };
                  updatedContent.learnedBy = updatedContent.learnedBy.includes(userId)
                    ? updatedContent.learnedBy.filter(id => id !== userId)
                    : [...updatedContent.learnedBy, userId];
                  return { ...item, content: updatedContent };
                }
                return item;
              });
            } else {
              return updatedFeed.map(content => {
                if (content.id === contentId) {
                  content.learnedBy = content.learnedBy.includes(userId)
                    ? content.learnedBy.filter(id => id !== userId)
                    : [...content.learnedBy, userId];
                }
                return content;
              });
            }
          }
          return updatedFeed;
        });
        
        // Update filtered content as well
        setFilteredContent(prevFiltered => {
          const updatedFiltered = [...prevFiltered];
          if (Array.isArray(updatedFiltered)) {
            if (activeTab === 'following') {
              return updatedFiltered.map(item => {
                if (item.content.id === contentId) {
                  const updatedContent = { ...item.content };
                  updatedContent.learnedBy = updatedContent.learnedBy.includes(userId)
                    ? updatedContent.learnedBy.filter(id => id !== userId)
                    : [...updatedContent.learnedBy, userId];
                  return { ...item, content: updatedContent };
                }
                return item;
              });
            } else {
              return updatedFiltered.map(content => {
                if (content.id === contentId) {
                  content.learnedBy = content.learnedBy.includes(userId)
                    ? content.learnedBy.filter(id => id !== userId)
                    : [...content.learnedBy, userId];
                }
                return content;
              });
            }
          }
          return updatedFiltered;
        });
      }
    } catch (error) {
      console.error("Error marking content as learned:", error);
    }
  };

  const handleBookmark = async (contentId) => {
    try {
      const response = await axios.post(
        '/api/v1/educational/bookmark',
        { contentId, userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.status === 'success') {
        setContentFeed(prevFeed => {
          const updatedFeed = [...prevFeed];
          if (Array.isArray(updatedFeed)) {
            if (activeTab === 'following') {
              return updatedFeed.map(item => {
                if (item.content.id === contentId) {
                  const updatedContent = { ...item.content };
                  updatedContent.bookmarkedBy = updatedContent.bookmarkedBy.includes(userId)
                    ? updatedContent.bookmarkedBy.filter(id => id !== userId)
                    : [...updatedContent.bookmarkedBy, userId];
                  return { ...item, content: updatedContent };
                }
                return item;
              });
            } else {
              return updatedFeed.map(content => {
                if (content.id === contentId) {
                  content.bookmarkedBy = content.bookmarkedBy.includes(userId)
                    ? content.bookmarkedBy.filter(id => id !== userId)
                    : [...content.bookmarkedBy, userId];
                }
                return content;
              });
            }
          }
          return updatedFeed;
        });
        
        // Update filtered content as well
        setFilteredContent(prevFiltered => {
          const updatedFiltered = [...prevFiltered];
          if (Array.isArray(updatedFiltered)) {
            if (activeTab === 'following') {
              return updatedFiltered.map(item => {
                if (item.content.id === contentId) {
                  const updatedContent = { ...item.content };
                  updatedContent.bookmarkedBy = updatedContent.bookmarkedBy.includes(userId)
                    ? updatedContent.bookmarkedBy.filter(id => id !== userId)
                    : [...updatedContent.bookmarkedBy, userId];
                  return { ...item, content: updatedContent };
                }
                return item;
              });
            } else {
              return updatedFiltered.map(content => {
                if (content.id === contentId) {
                  content.bookmarkedBy = content.bookmarkedBy.includes(userId)
                    ? content.bookmarkedBy.filter(id => id !== userId)
                    : [...content.bookmarkedBy, userId];
                }
                return content;
              });
            }
          }
          return updatedFiltered;
        });
      }
    } catch (error) {
      console.error("Error bookmarking content:", error);
    }
  };

  const handleViewPDF = (content) => {
    setSelectedPDFContent(content);
    setShowPDFViewer(true);
  };
  
  const handleViewText = (content) => {
    // Create a modal for text content viewing
    setSelectedPDFContent({
      ...content,
      contentType: 'TEXT'
    });
    setShowPDFViewer(true);
  };
  
  // Handle opening update modal
  const handleUpdateClick = (content) => {
    setContentToUpdate(content);
    setUpdatedTitle(content.title);
    setUpdatedDescription(content.description);
    setUpdatedContent(content.content || '');
    setUpdatedTags(content.tags ? content.tags.join(', ') : '');
    setShowUpdateModal(true);
  };
  
  // Handle update submission
  const handleUpdateSubmit = async () => {
    try {
      // Convert tags string back to array
      const tagsArray = updatedTags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      const updatedContentData = {
        id: contentToUpdate.id,
        userId: userId,
        title: updatedTitle,
        description: updatedDescription,
        content: updatedContent,
        contentType: contentToUpdate.contentType,
        fileUrl: contentToUpdate.fileUrl,
        tags: tagsArray
      };
      
      const response = await axios.put(
        '/api/v1/educational/update',
        updatedContentData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      
      if (response.data.status === 'success') {
        // Update the content in the feed
        setContentFeed(prevFeed => 
          prevFeed.map(content => 
            content.id === contentToUpdate.id ? response.data.payload : content
          )
        );
        
        // Update filtered content as well
        setFilteredContent(prevFiltered => 
          prevFiltered.map(content => 
            content.id === contentToUpdate.id ? response.data.payload : content
          )
        );
        
        // Close the modal
        setShowUpdateModal(false);
      } else {
        alert(`Update failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating content:", error);
      alert(`Error updating content: ${error.response?.data?.message || error.message}`);
    }
  };
  
  // Handle delete click
  const handleDeleteClick = (content) => {
    setContentToDelete(content);
    setShowDeleteConfirm(true);
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.post(
        '/api/v1/educational/delete',
        { contentId: contentToDelete.id, userId },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      
      if (response.data.status === 'success') {
        // Remove the deleted content from the feed
        setContentFeed(prevFeed => 
          prevFeed.filter(content => content.id !== contentToDelete.id)
        );
        
        // Remove from filtered content as well
        setFilteredContent(prevFiltered => 
          prevFiltered.filter(content => content.id !== contentToDelete.id)
        );
        
        // Close the confirmation modal
        setShowDeleteConfirm(false);
      } else {
        alert(`Delete failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      alert(`Error deleting content: ${error.response?.data?.message || error.message}`);
    }
  };

  const renderContent = (item) => {
    const content = activeTab === 'following' ? item.content : item;
    const user = activeTab === 'following' ? item.user : null;
    
    const isLearned = content.learnedBy?.includes(userId);
    const isBookmarked = content.bookmarkedBy?.includes(userId);
    const isOwner = content.userId === userId;

    return (
      <div key={content.id} className="content-card">
        {user && (
          <div className="content-author">
            <div className="author-avatar">
              {user.fullname?.charAt(0) || user.username?.charAt(0) || 'U'}
            </div>
            <span className="author-name">{user.fullname || user.username}</span>
          </div>
        )}

        <h3 className="content-title">{content.title}</h3>
        <p className="content-description">{content.description}</p>

        {content.tags?.length > 0 && (
          <div className="content-tags">
            {content.tags.map((tag, idx) => (
              <span key={idx} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="content-info">
          <span className="content-type">
            {content.contentType === 'PDF' ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>PDF</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="21" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="21" y1="18" x2="3" y2="18"></line>
                </svg>
                <span>Text</span>
              </>
            )}
          </span>
          <span className="content-date">
            {new Date(content.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="content-actions">
          <button 
            className={`action-btn ${isLearned ? 'active learned-btn' : ''}`}
            onClick={() => handleMarkAsLearned(content.id)}
            title={isLearned ? "Remove from learned" : "Mark as learned"}
          >
            {isLearned ? (
              <>
                <CheckCircle size={16} />
                <span>Learned</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Mark as Learned</span>
              </>
            )}
          </button>

          <button 
            className={`action-btn ${isBookmarked ? 'active bookmark-btn' : ''}`}
            onClick={() => handleBookmark(content.id)}
            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck size={16} />
                <span>Bookmarked</span>
              </>
            ) : (
              <>
                <BookmarkPlus size={16} />
                <span>Bookmark</span>
              </>
            )}
          </button>

          {content.contentType === 'PDF' && content.content && (
            <button 
              className="action-btn view-btn"
              onClick={() => handleViewPDF(content)}
              title="View PDF"
            >
              <Eye size={16} />
              <span>View PDF</span>
            </button>
          )}

          {content.contentType === 'TEXT' && (
            <button 
              className="action-btn view-btn"
              onClick={() => handleViewText(content)}
              title="View Content"
            >
              <Eye size={16} />
              <span>View Content</span>
            </button>
          )}
          
          {/* Show Edit and Delete buttons only if user owns the content */}
          {isOwner && (
            <div className="owner-actions">
              <button 
                className="action-btn edit-btn"
                onClick={() => handleUpdateClick(content)}
                title="Edit"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
              
              <button 
                className="action-btn delete-btn"
                onClick={() => handleDeleteClick(content)}
                title="Delete"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="edu-content-container">
      <div className="content-header">
        <h2>Educational Content</h2>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search content..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} className="search-icon" />
        </div>
      </div>
      
      <div className="content-tabs">
        <button 
          className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
        <button 
          className={`tab-btn ${activeTab === 'learned' ? 'active' : ''}`}
          onClick={() => setActiveTab('learned')}
        >
          Learned
        </button>
        <button 
          className={`tab-btn ${activeTab === 'bookmarked' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarked')}
        >
          Bookmarked
        </button>
        <button 
          className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => setActiveTab('user')}
        >
          My Content
        </button>
      </div>

      <div className="content-feed">
        {loading ? (
          <div className="loading-state">
            <Loader size={32} className="loading-spinner" />
            <span>Loading content...</span>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <BookOpen size={48} />
            </div>
            {searchQuery ? (
              <p>No content found matching "{searchQuery}"</p>
            ) : (
              <p>No content found in this section</p>
            )}
          </div>
        ) : (
          <div className="content-list">
            {filteredContent.map(item => renderContent(item))}
          </div>
        )}
      </div>

      {/* PDF/Text Viewer Modal */}
      <Modal 
        show={showPDFViewer} 
        onHide={() => setShowPDFViewer(false)} 
        size="lg"
        centered
        className="content-viewer-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedPDFContent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPDFContent?.contentType === 'PDF' ? (
            <MultiPDFViewer pdfs={[selectedPDFContent.content]} />
          ) : (
            <div className="text-content-viewer">
              {selectedPDFContent?.content}
            </div>
          )}
        </Modal.Body>
      </Modal>
      
      {/* Update Content Modal */}
      <Modal 
        show={showUpdateModal} 
        onHide={() => setShowUpdateModal(false)}
        centered
        className="update-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Educational Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                value={updatedTitle} 
                onChange={(e) => setUpdatedTitle(e.target.value)} 
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={updatedDescription} 
                onChange={(e) => setUpdatedDescription(e.target.value)} 
              />
            </Form.Group>
            
            {contentToUpdate?.contentType === 'TEXT' && (
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={5} 
                  value={updatedContent} 
                  onChange={(e) => setUpdatedContent(e.target.value)} 
                />
              </Form.Group>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control 
                type="text" 
                value={updatedTags} 
                onChange={(e) => setUpdatedTags(e.target.value)} 
                placeholder="tag1, tag2, tag3" 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteConfirm} 
        onHide={() => setShowDeleteConfirm(false)}
        centered
        className="delete-confirm-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete <strong>"{contentToDelete?.title}"</strong>?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EducationalContentFeed;