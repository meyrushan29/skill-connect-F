import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LineChart, BarChart, User, RefreshCw, Filter, ChevronDown, Bell, Award, TrendingUp } from 'lucide-react';
import { Spinner } from 'react-bootstrap';
import './ProgressDashboard.css';

const ProgressDashboard = ({ userId }) => {
  const [progressItems, setProgressItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [animationProgress, setAnimationProgress] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const [activeTab, setActiveTab] = useState('following'); // 'following' or 'user'
  
  // Fetch progress items based on active tab
  const fetchProgressItems = useCallback(async () => {
    const _id = localStorage.getItem("psnUserId");
    const endpoint = activeTab === 'following' ? '/api/v1/progress/following' : '/api/v1/progress/user';

    try {
      setRefreshing(true);
      const response = await axios.post(
        endpoint,
        { id: _id },
        {
          headers: {
            Authorization: localStorage.getItem("psnToken"),
          },
        }
      );
  
      if (response.data.status === 'success') {
        let items = [];
        if (activeTab === 'following') {
          // Extract progress items from the following data structure
          items = (response.data.payload || []).map(item => ({
            ...item.progress,
            user: item.user
          }));
        } else {
          items = response.data.payload || [];
        }
        
        setProgressItems(items);
  
        // Extract unique categories
        const uniqueCategories = [...new Set(items.map(item => item.category).filter(Boolean))];
        setCategories(uniqueCategories);
        setLastUpdated(new Date());
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(`Failed to fetch progress items: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);
  
  // Setup auto-refresh interval (every 30 seconds)
  useEffect(() => {
    fetchProgressItems();
    const interval = setInterval(() => {
      fetchProgressItems();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchProgressItems]);
  
  // Manual refresh function
  const handleRefresh = () => {
    fetchProgressItems();
  };

  // Animation effect on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate progress percentage
  const calculateProgress = (current, initial, target) => {
    if (target === initial) return 0;
    const progress = ((current - initial) / (target - initial)) * 100;
    return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
  };
  
  // Filter progress items by category
  const getFilteredItems = () => {
    let filtered = progressItems;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      let valueA, valueB;
      
      if (sortBy === 'progress') {
        valueA = calculateProgress(a.currentValue, a.initialValue, a.targetValue);
        valueB = calculateProgress(b.currentValue, b.initialValue, b.targetValue);
      } else if (sortBy === 'title') {
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        valueA = new Date(a[sortBy]);
        valueB = new Date(b[sortBy]);
      }
      
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    return filtered;
  };
  
  // Get statistics
  const getStats = () => {
    const stats = {
      total: progressItems.length,
      completed: progressItems.filter(item => 
        calculateProgress(item.currentValue, item.initialValue, item.targetValue) >= 100
      ).length,
      inProgress: progressItems.filter(item => {
        const progress = calculateProgress(item.currentValue, item.initialValue, item.targetValue);
        return progress > 0 && progress < 100;
      }).length,
      notStarted: progressItems.filter(item => 
        calculateProgress(item.currentValue, item.initialValue, item.targetValue) === 0
      ).length
    };
    
    // Calculate additional stats
    stats.completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
    stats.averageProgress = progressItems.length > 0 ? 
      Math.round(progressItems.reduce((sum, item) => sum + calculateProgress(item.currentValue, item.initialValue, item.targetValue), 0) / progressItems.length) : 
      0;
    
    return stats;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time elapsed since update
  const formatTimeElapsed = (dateString) => {
    const now = new Date();
    const updated = new Date(dateString);
    const seconds = Math.floor((now - updated) / 1000);
    
    if (seconds < 60) return `${seconds} sec ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };
  
  const filteredItems = getFilteredItems();
  const stats = getStats();
  
  return (
    <div className="progress-dashboard">
      {/* Header */}
      <div className="dashboard-header" style={{
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
      }}>
        <div className="header-left">
          <div className="header-icon">
            <LineChart size={32} />
          </div>
          <h1>PROGRESS DASHBOARD</h1>
        </div>
        
        <div className="header-actions">
          <div className="last-updated">
            {lastUpdated && (
              <span>Last updated: {formatTimeElapsed(lastUpdated)}</span>
            )}
          </div>
          <button 
            className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={18} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs" style={{
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 15}px)`,
      }}>
        <button 
          className={`tab-button ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          <User size={18} />
          <span>Following</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => setActiveTab('user')}
        >
          <Award size={18} />
          <span>My Progress</span>
        </button>
      </div>

      {/* Main content container */}
      <div className="dashboard-content" style={{
        opacity: animationProgress / 100,
        transform: `translateY(${(1 - animationProgress / 100) * 15}px)`,
      }}>
        {error && (
          <div className="error-message">
            <Bell size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <Spinner animation="border" className="loading-spinner" />
            <p>Loading progress data...</p>
          </div>
        ) : progressItems.length === 0 ? (
          <div className="empty-list">
            <p>No progress items found. {activeTab === 'user' ? 'Start by creating your first progress tracker.' : 'Follow users to see their progress.'}</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="stats-section" style={{
              opacity: animationProgress / 100,
              transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
            }}>
              <h2 className="section-title">
                <TrendingUp size={20} />
                <span>Progress Overview</span>
              </h2>
              
              <div className="stats-cards">
                <div className="stats-card">
                  <h3>Total</h3>
                  <p className="stats-value">{stats.total}</p>
                </div>

                <div className="stats-card">
                  <h3>Completed</h3>
                  <p className="stats-value success">{stats.completed}</p>
                </div>

                <div className="stats-card">
                  <h3>In Progress</h3>
                  <p className="stats-value warning">{stats.inProgress}</p>
                </div>

                <div className="stats-card">
                  <h3>Not Started</h3>
                  <p className="stats-value info">{stats.notStarted}</p>
                </div>
                
                <div className="stats-card highlight">
                  <h3>Completion Rate</h3>
                  <p className="stats-value">{stats.completionRate}%</p>
                </div>

                <div className="stats-card highlight">
                  <h3>Avg. Progress</h3>
                  <p className="stats-value">{stats.averageProgress}%</p>
                </div>
              </div>
            </div>
            
            {/* Filters Section */}
            <div className="filters-section">
              <div className="filters-header">
                <h2 className="section-title">
                  <Filter size={20} />
                  <span>Filters & Categories</span>
                </h2>
                <button 
                  className="toggle-filters-button"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                  <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
                </button>
              </div>
              
              {showFilters && (
                <div className="filters-controls">
                  <div className="filter-group">
                    <label>Category:</label>
                    <div className="categories-list">
                      <button 
                        className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                      >
                        All
                      </button>
                      
                      {categories.map((category) => (
                        <button 
                          key={category} 
                          className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="filter-group sort-controls">
                    <label>Sort by:</label>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-select"
                    >
                      <option value="updatedAt">Last Updated</option>
                      <option value="createdAt">Date Created</option>
                      <option value="title">Title</option>
                      <option value="progress">Progress</option>
                    </select>
                    
                    <button 
                      className="sort-direction-button"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                    </button>
                  </div>
                  
                  <div className="filter-group view-controls">
                    <label>View:</label>
                    <div className="view-buttons">
                      <button
                        className={`view-button ${viewMode === 'card' ? 'active' : ''}`}
                        onClick={() => setViewMode('card')}
                      >
                        Cards
                      </button>
                      <button
                        className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                      >
                        List
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Progress Items Header */}
            <div className="progress-items-header">
              <h2 className="section-title">
                {selectedCategory === 'all' ? 'All Progress Items' : `${selectedCategory} Progress`}
                <span className="items-count">({filteredItems.length} items)</span>
              </h2>
              {selectedCategory !== 'all' && (
                <button 
                  className="clear-filter-button"
                  onClick={() => setSelectedCategory('all')}
                >
                  Clear Filter
                </button>
              )}
            </div>
            
            {/* Progress Items List */}
            <div className={`progress-items ${viewMode === 'list' ? 'list-view' : 'card-view'}`}>
              {filteredItems.map((progress, index) => {
                const progressPercent = calculateProgress(
                  progress.currentValue,
                  progress.initialValue,
                  progress.targetValue
                );
                
                const progressColor = 
                  progressPercent >= 100 ? 'success' : 
                  progressPercent > 50 ? 'good' : 
                  progressPercent > 25 ? 'warning' : 'info';
                
                return (
                  <div 
                    key={progress.id || index} 
                    className={`progress-item ${progressColor}`}
                    style={{
                      transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
                      opacity: animationProgress / 100,
                      transitionDelay: `${0.3 + index * 0.05}s`
                    }}
                  >
                    {/* User info */}
                    {progress.user && (
                      <div className="progress-user">
                        <div className="user-avatar">
                          <User size={18} />
                        </div>
                        <div className="user-info">
                          <div className="user-name">
                            {progress.user.firstName} {progress.user.lastName}
                          </div>
                          <div className="user-email">
                            {progress.user.email}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="progress-header">
                      <h3 className="progress-title">
                        {progress.title}
                      </h3>
                      
                      {progress.category && (
                        <span className="progress-category">
                          {progress.category}
                        </span>
                      )}
                    </div>
                    
                    {progress.description && (
                      <p className="progress-description">
                        {progress.description}
                      </p>
                    )}
                    
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-bar ${progressColor}`}
                        style={{ width: `${progressPercent}%` }}
                      >
                        {progressPercent >= 15 && (
                          <span className="progress-percentage">{Math.round(progressPercent)}%</span>
                        )}
                      </div>
                      {progressPercent < 15 && (
                        <span className="progress-percentage-outside">{Math.round(progressPercent)}%</span>
                      )}
                    </div>
                    
                    <div className="progress-details">
                      <div className="progress-values">
                        <div className="progress-value">
                          <span className="label">Initial:</span>
                          <span className="value">{progress.initialValue} {progress.unit}</span>
                        </div>
                        <div className="progress-value current">
                          <span className="label">Current:</span>
                          <span className="value">{progress.currentValue} {progress.unit}</span>
                        </div>
                        <div className="progress-value">
                          <span className="label">Target:</span>
                          <span className="value">{progress.targetValue} {progress.unit}</span>
                        </div>
                      </div>
                      
                      <div className="progress-meta">
                        <div className="progress-date">
                          <span className="label">Updated:</span>
                          <span className="value">{formatTimeElapsed(progress.updatedAt)}</span>
                        </div>
                        
                        {viewMode === 'list' && (
                          <div className="progress-percentage-badge">
                            {Math.round(progressPercent)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboard;