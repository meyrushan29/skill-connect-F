import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Upload, X, AlertTriangle, CheckCircle } from 'lucide-react';
import MultiPDFUpload from './MultiPDFUpload';
import './EducationalContent.css';

const EducationalContentShare = ({ userId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('TEXT');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [pdfFiles, setPdfFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePDFUpload = (processedPDFs) => {
    setPdfFiles(processedPDFs);
    // Set the first PDF's base64 as content
    if (processedPDFs.length > 0) {
      setContent(processedPDFs[0].base64);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;
    
    // Form validation
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    
    if (!description.trim()) {
      setError("Please enter a description");
      return;
    }
    
    if (contentType === 'TEXT' && !content.trim()) {
      setError("Please enter content text");
      return;
    }
    
    if (contentType === 'PDF' && pdfFiles.length === 0) {
      setError("Please upload a PDF file");
      return;
    }
    
    setUploading(true);
    setMessage('');
    setError('');
  
    try {
      const token = localStorage.getItem("psnToken");
      
      // Process tags into an array
      const tagsArray = tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      // Create educational content with PDF base64 as content
      const contentData = {
        userId,
        title: title.trim(),
        description: description.trim(),
        contentType,
        content: contentType === 'TEXT' ? content.trim() : pdfFiles[0]?.base64 || '',
        fileUrl: '', // No need for fileUrl since we're storing base64 in content
        tags: tagsArray
      };
      
      const response = await axios.post('/api/v1/educational/create', contentData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      
      if (response.data.status === 'success') {
        setMessage('Content shared successfully!');
        // Reset form
        setTitle('');
        setDescription('');
        setContentType('TEXT');
        setContent('');
        setTags('');
        setPdfFiles([]);
      } else {
        setError(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Operation error:', error);
      setError(`Error: ${error.message || 'An unknown error occurred'}`);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="edu-content-container share-container">
      <div className="content-header">
        <h2>Share Educational Content</h2>
        <p>Share your knowledge with the community</p>
      </div>
      
      {error && (
        <div className="message-banner error">
          <AlertTriangle size={18} />
          <span>{error}</span>
          <button className="close-message" onClick={() => setError('')}>
            <X size={16} />
          </button>
        </div>
      )}
      
      {message && (
        <div className="message-banner success">
          <CheckCircle size={18} />
          <span>{message}</span>
          <button className="close-message" onClick={() => setMessage('')}>
            <X size={16} />
          </button>
        </div>
      )}
      
      <form onSubmit={handleFormSubmit} className="edu-content-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Enter a descriptive title"
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Provide a brief description of your content"
            required 
          />
        </div>
        
        <div className="form-group content-type-selector">
          <label>Content Type</label>
          <div className="type-buttons">
            <button 
              type="button"
              className={`type-btn ${contentType === 'TEXT' ? 'active' : ''}`}
              onClick={() => setContentType('TEXT')}
            >
              <span className="btn-icon">📝</span>
              <span>Text</span>
            </button>
            <button 
              type="button"
              className={`type-btn ${contentType === 'PDF' ? 'active' : ''}`}
              onClick={() => setContentType('PDF')}
            >
              <span className="btn-icon">📄</span>
              <span>PDF</span>
            </button>
          </div>
        </div>
        
        {contentType === 'TEXT' ? (
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea 
              id="content" 
              className="content-textarea"
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Write your educational content here"
              required 
            />
          </div>
        ) : (
          <div className="form-group pdf-upload-group">
            <label>PDF Files</label>
            <MultiPDFUpload multiHandle={handlePDFUpload} />
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input 
            type="text" 
            id="tags" 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            placeholder="e.g. science, biology, notes (comma separated)" 
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="loading-spinner"></span>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={18} />
              <span>Share Content</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EducationalContentShare;