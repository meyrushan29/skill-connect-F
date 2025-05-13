import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFollowerAccounts } from "../../feature/followingAccounts/followingAccountSlice";
import FollowerAccountItem from "./FollowerAccountItem";
import { 
  Users, 
  Search, 
  ChevronDown, 
  UserPlus, 
  UserMinus, 
  Filter, 
  RefreshCw, 
  AlertCircle 
} from "lucide-react";

// MUI Imports for enhanced UI
import { 
  Box, 
  Typography, 
  TextField, 
  InputAdornment, 
  Button, 
  Chip, 
  Avatar, 
  Paper, 
  Skeleton, 
  Fade, 
  Grow, 
  Menu, 
  MenuItem, 
  IconButton, 
  Tooltip, 
  Divider, 
  useMediaQuery, 
  useTheme, 
  alpha
} from '@mui/material';

function FollowerList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const storeFollowerAccounts = useSelector(
    (state) => state.followingAccountReducer.followerAccounts
  );
  
  const [animationProgress, setAnimationProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);
  
  // Derived state for filtered followers
  const filteredFollowers = storeFollowerAccounts 
    ? storeFollowerAccounts
        .filter(follower => {
          const fullName = `${follower.firstName} ${follower.lastName}`.toLowerCase();
          const searchMatch = searchTerm === "" || fullName.includes(searchTerm.toLowerCase());
          const filterMatch = activeFilter === "all" || 
                             (activeFilter === "recent" && follower.isRecent) || 
                             (activeFilter === "mutual" && follower.isMutual);
          return searchMatch && filterMatch;
        })
        .sort((a, b) => {
          if (sortBy === "newest") return new Date(b.followDate) - new Date(a.followDate);
          if (sortBy === "oldest") return new Date(a.followDate) - new Date(b.followDate);
          if (sortBy === "name") return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          return 0;
        })
    : [];

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(getFollowerAccounts()).unwrap();
        setLoadingError(false);
      } catch (error) {
        console.error("Error fetching followers:", error);
        setLoadingError(true);
      } finally {
        setTimeout(() => setLoading(false), 1000); // Simulate loading
      }
    };
    
    fetchData();
    
    // Animation effect
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  const handleFilterOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleSortChange = (option) => {
    setSortBy(option);
    handleFilterClose();
  };
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    handleFilterClose();
  };
  
  const handleRefresh = () => {
    setLoading(true);
    dispatch(getFollowerAccounts())
      .then(() => {
        setLoading(false);
        setLoadingError(false);
      })
      .catch((err) => {
        setLoading(false);
        setLoadingError(true);
        console.error("Error refreshing data:", err);
      });
  };

  const getGradientBackground = () => {
    return {
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #0288d1 100%)'
    };
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: (theme) => theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #0288d1 100%)' 
        : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: { xs: '1.5rem 1rem', md: '2.5rem 2rem' },
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity: 0.6
      }}>
        {/* Circular elements */}
        {[...Array(12)].map((_, i) => (
          <Box 
            key={i}
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              background: (theme) => theme.palette.mode === 'dark'
                ? 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                : 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0.03) 100%)',
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `scale(${animationProgress / 100})`,
              transition: 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: `${i * 0.08}s`,
              opacity: 0.7,
              backdropFilter: 'blur(5px)'
            }}
          />
        ))}
        
        {/* Background shapes */}
        {[...Array(6)].map((_, i) => (
          <Box 
            key={`shape-${i}`}
            sx={{
              position: 'absolute',
              borderRadius: '16px',
              border: (theme) => theme.palette.mode === 'dark'
                ? '2px solid rgba(255, 255, 255, 0.08)'
                : '2px solid rgba(25, 118, 210, 0.08)',
              width: `${Math.random() * 150 + 200}px`,
              height: `${Math.random() * 150 + 200}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg) scale(${animationProgress / 100})`,
              transition: 'transform 2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: `${i * 0.15 + 0.3}s`
            }}
          />
        ))}
      </Box>

      {/* Content container */}
      <Box sx={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Header */}
        <Fade in={animationProgress === 100} timeout={1000}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            marginBottom: '2rem',
            width: '100%',
            textAlign: { xs: 'center', sm: 'left' }
          }}>
            <Box sx={{
              backgroundColor: '#1565c0',
              padding: '1rem',
              borderRadius: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)'
            }}>
              <Users size={40} strokeWidth={1.5} style={{ color: '#FFFFFF' }} />
            </Box>
            
            <Box>
              <Typography 
                variant="h3" 
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#0a3060',
                  letterSpacing: '-0.025em',
                  mb: 0.5
                }}
              >
                Your Followers
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  maxWidth: '600px'
                }}
              >
                Manage your followers and see who's interested in your content
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* Search and Filter */}
        <Fade in={animationProgress === 100} timeout={1200}>
          <Paper 
            elevation={0}
            sx={{ 
              width: '100%', 
              mb: 3, 
              p: { xs: 2, md: 3 },
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              backdropFilter: 'blur(10px)',
              background: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(13, 71, 161, 0.25)' 
                : 'rgba(255, 255, 255, 0.7)'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
              width: '100%'
            }}>
              {/* Search bar */}
              <TextField
                placeholder="Search followers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{
                  maxWidth: { md: '400px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.05)' 
                      : 'rgba(0,0,0,0.02)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2196f3'
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} strokeWidth={1.5} color={theme.palette.mode === 'dark' ? "#90caf9" : "#1976d2"} />
                    </InputAdornment>
                  )
                }}
              />
              
              <Box sx={{ 
                display: 'flex',
                gap: 1,
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                justifyContent: { xs: 'space-between', md: 'flex-end' }
              }}>
                {/* Filter buttons */}
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Filter size={18} strokeWidth={1.5} />}
                  endIcon={<ChevronDown size={16} strokeWidth={1.5} />}
                  onClick={handleFilterOpen}
                  sx={{ 
                    borderRadius: '10px', 
                    textTransform: 'none',
                    minWidth: '120px'
                  }}
                >
                  Filter
                </Button>
                
                <Menu
                  anchorEl={filterMenuAnchor}
                  open={Boolean(filterMenuAnchor)}
                  onClose={handleFilterClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { 
                      borderRadius: '12px', 
                      mt: 1.5,
                      minWidth: '220px',
                      overflow: 'hidden'
                    }
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ px: 2, py: 1, fontWeight: 600, color: 'text.secondary' }}
                  >
                    Sort by
                  </Typography>
                  <MenuItem 
                    onClick={() => handleSortChange('newest')}
                    sx={{ 
                      py: 1.5,
                      bgcolor: sortBy === 'newest' ? alpha('#2196f3', 0.1) : 'transparent'
                    }}
                  >
                    <Box sx={{ 
                      width: 18, 
                      height: 18, 
                      borderRadius: '50%', 
                      bgcolor: sortBy === 'newest' ? '#2196f3' : 'transparent',
                      border: sortBy !== 'newest' ? '1px solid #bdbdbd' : 'none',
                      mr: 1.5
                    }} />
                    Newest first
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleSortChange('oldest')}
                    sx={{ 
                      py: 1.5,
                      bgcolor: sortBy === 'oldest' ? alpha('#2196f3', 0.1) : 'transparent'
                    }}
                  >
                    <Box sx={{ 
                      width: 18, 
                      height: 18, 
                      borderRadius: '50%', 
                      bgcolor: sortBy === 'oldest' ? '#2196f3' : 'transparent',
                      border: sortBy !== 'oldest' ? '1px solid #bdbdbd' : 'none',
                      mr: 1.5
                    }} />
                    Oldest first
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleSortChange('name')}
                    sx={{ 
                      py: 1.5,
                      bgcolor: sortBy === 'name' ? alpha('#2196f3', 0.1) : 'transparent' 
                    }}
                  >
                    <Box sx={{ 
                      width: 18, 
                      height: 18, 
                      borderRadius: '50%', 
                      bgcolor: sortBy === 'name' ? '#2196f3' : 'transparent',
                      border: sortBy !== 'name' ? '1px solid #bdbdbd' : 'none',
                      mr: 1.5
                    }} />
                    Name
                  </MenuItem>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography 
                    variant="subtitle2" 
                    sx={{ px: 2, py: 1, fontWeight: 600, color: 'text.secondary' }}
                  >
                    Filter by
                  </Typography>
                  <MenuItem 
                    onClick={() => handleFilterChange('all')}
                    sx={{ 
                      py: 1.5,
                      bgcolor: activeFilter === 'all' ? alpha('#2196f3', 0.1) : 'transparent'
                    }}
                  >
                    <Box sx={{ 
                      width: 18, 
                      height: 18, 
                      borderRadius: '50%', 
                      bgcolor: activeFilter === 'all' ? '#2196f3' : 'transparent',
                      border: activeFilter !== 'all' ? '1px solid #bdbdbd' : 'none',
                      mr: 1.5
                    }} />
                    All followers
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleFilterChange('recent')}
                    sx={{ 
                      py: 1.5,
                      bgcolor: activeFilter === 'recent' ? alpha('#2196f3', 0.1) : 'transparent'
                    }}
                  >
                    <Box sx={{ 
                      width: 18, 
                      height: 18, 
                      borderRadius: '50%', 
                      bgcolor: activeFilter === 'recent' ? '#2196f3' : 'transparent',
                      border: activeFilter !== 'recent' ? '1px solid #bdbdbd' : 'none',
                      mr: 1.5
                    }} />
                    Recent followers
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleFilterChange('mutual')}
                    sx={{ 
                      py: 1.5,
                      bgcolor: activeFilter === 'mutual' ? alpha('#2196f3', 0.1) : 'transparent'
                    }}
                  >
                    <Box sx={{ 
                      width: 18, 
                      height: 18, 
                      borderRadius: '50%', 
                      bgcolor: activeFilter === 'mutual' ? '#2196f3' : 'transparent',
                      border: activeFilter !== 'mutual' ? '1px solid #bdbdbd' : 'none',
                      mr: 1.5
                    }} />
                    Mutual followers
                  </MenuItem>
                </Menu>
                
                {/* Refresh button */}
                <Tooltip title="Refresh list">
                  <IconButton 
                    onClick={handleRefresh}
                    color="primary"
                    sx={{ 
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <RefreshCw size={18} strokeWidth={1.5} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            {/* Active filters */}
            {(searchTerm || activeFilter !== 'all' || sortBy !== 'newest') && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {searchTerm && (
                  <Chip 
                    label={`Search: "${searchTerm}"`} 
                    onDelete={() => setSearchTerm('')}
                    size="small"
                    sx={{ borderRadius: '8px' }}
                  />
                )}
                {sortBy !== 'newest' && (
                  <Chip 
                    label={`Sort: ${sortBy === 'name' ? 'By name' : sortBy === 'oldest' ? 'Oldest first' : 'Newest first'}`} 
                    onDelete={() => setSortBy('newest')}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: '8px' }}
                  />
                )}
                {activeFilter !== 'all' && (
                  <Chip 
                    label={`Filter: ${activeFilter === 'recent' ? 'Recent followers' : 'Mutual followers'}`} 
                    onDelete={() => setActiveFilter('all')}
                    size="small"
                    color="primary"
                    sx={{ borderRadius: '8px' }}
                  />
                )}
              </Box>
            )}
          </Paper>
        </Fade>

        {/* Follower accounts content */}
        <Grow in={animationProgress === 100} timeout={1500}>
          <Paper 
            elevation={0} 
            sx={{ 
              width: '100%',
              borderRadius: '16px',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              background: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(10, 25, 41, 0.4)' 
                : 'rgba(255, 255, 255, 0.85)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Loading state */}
            {loading ? (
              <Box sx={{ p: 3 }}>
                {[...Array(5)].map((_, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    py: 2,
                    mb: 1,
                    px: { xs: 1, sm: 3 }
                  }}>
                    <Skeleton variant="circular" width={50} height={50} sx={{ mr: 2 }} />
                    <Box sx={{ width: '100%' }}>
                      <Skeleton variant="text" width={150} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width={100} />
                    </Box>
                    <Skeleton variant="rectangular" width={100} height={36} sx={{ ml: 'auto', borderRadius: '8px' }} />
                  </Box>
                ))}
              </Box>
            ) : loadingError ? (
              // Error state
              <Box sx={{ 
                p: 5, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <AlertCircle size={48} color="#f44336" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                  Couldn't load your followers
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '500px' }}>
                  There was an error retrieving your follower list. Please try again or check your connection.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<RefreshCw size={16} />}
                  onClick={handleRefresh}
                  sx={{ borderRadius: '10px' }}
                >
                  Try Again
                </Button>
              </Box>
            ) : (
              // Follower list table
              filteredFollowers.length > 0 ? (
                <Box>
                  {/* Table for desktop */}
                  {!isMobile && (
                    <Box sx={{ 
                      width: '100%', 
                      overflowX: 'auto',
                      display: { xs: 'none', sm: 'block' }
                    }}>
                      <Box sx={{ 
                        display: 'table',
                        width: '100%',
                        borderCollapse: 'separate',
                        borderSpacing: '0 0.5rem',
                        px: 3,
                        pt: 2
                      }}>
                        {/* Table header */}
                        <Box sx={{ display: 'table-header-group' }}>
                          <Box sx={{ display: 'table-row' }}>
                            <Typography component="div" sx={{ 
                              display: 'table-cell', 
                              color: 'text.secondary',
                              fontWeight: 500,
                              fontSize: '0.875rem',
                              py: 1.5
                            }}>
                              Follower
                            </Typography>
                            <Typography component="div" sx={{ 
                              display: 'table-cell', 
                              color: 'text.secondary',
                              fontWeight: 500,
                              fontSize: '0.875rem',
                              py: 1.5,
                              width: '25%',
                              display: { xs: 'none', md: 'table-cell' }
                            }}>
                              Followed Since
                            </Typography>
                            <Typography component="div" sx={{ 
                              display: 'table-cell', 
                              color: 'text.secondary',
                              fontWeight: 500,
                              fontSize: '0.875rem',
                              py: 1.5,
                              textAlign: 'right',
                              pr: 1
                            }}>
                              Actions
                            </Typography>
                          </Box>
                        </Box>
                        
                        {/* Table body */}
                        <Box sx={{ display: 'table-row-group' }}>
                          {filteredFollowers.map((follower) => (
                            <FollowerAccountItem
                              key={follower.id}
                              id={follower.id}
                              firstName={follower.firstName}
                              lastName={follower.lastName}
                              followDate={follower.followDate || "2023-05-15"}
                              isMutual={follower.isMutual || Math.random() > 0.5}
                              tabularView={true}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  )}
                  
                  {/* Card list for mobile */}
                  <Box sx={{ 
                    display: { xs: 'block', sm: 'none' },
                    p: 2
                  }}>
                    {filteredFollowers.map((follower) => (
                      <FollowerAccountItem
                        key={follower.id}
                        id={follower.id}
                        firstName={follower.firstName}
                        lastName={follower.lastName}
                        followDate={follower.followDate || "2023-05-15"}
                        isMutual={follower.isMutual || Math.random() > 0.5}
                        tabularView={false}
                      />
                    ))}
                  </Box>
                </Box>
              ) : (
                // Empty state
                <Box sx={{ 
                  p: 5, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  <Box sx={{ 
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: (theme) => alpha(theme.palette.primary.main, 0.1),
                    mb: 2
                  }}>
                    <Users size={40} color="#2196f3" strokeWidth={1.5} />
                  </Box>
                  <Typography variant="h6" color="textPrimary" sx={{ mb: 1 }}>
                    No followers found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: '500px' }}>
                    {searchTerm || activeFilter !== 'all' 
                      ? "No followers match your current filters. Try adjusting your search or filter criteria."
                      : "You don't have any followers yet. Start engaging with the community to grow your network."}
                  </Typography>
                  {(searchTerm || activeFilter !== 'all') && (
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => {
                        setSearchTerm('');
                        setActiveFilter('all');
                      }}
                      sx={{ borderRadius: '10px' }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Box>
              )
            )}
            
            {/* Status footer */}
            {!loading && !loadingError && filteredFollowers.length > 0 && (
              <Box sx={{ 
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5)
              }}>
                <Typography variant="body2" color="text.secondary">
                  {filteredFollowers.length} {filteredFollowers.length === 1 ? 'follower' : 'followers'} 
                  {(searchTerm || activeFilter !== 'all') ? ' (filtered)' : ''}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {/* For expandability with pagination or bulk actions */}
                  <Button 
                    variant="text" 
                    size="small" 
                    startIcon={<UserPlus size={16} />}
                    sx={{ 
                      textTransform: 'none', 
                      borderRadius: '8px',
                      display: { xs: 'none', sm: 'flex' }
                    }}
                    onClick={() => navigate('/find-friends')}
                  >
                    Find People
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grow>
      </Box>
    </Box>
  );
}

// Mock update to FollowerAccountItem to show how it would work with the enhanced UI
// In a real implementation, you would update the actual component
/* 
function FollowerAccountItem({ id, firstName, lastName, followDate, isMutual, tabularView }) {
  const handleViewProfile = () => {
    // Navigate to profile
  };

  const handleUnfollow = () => {
    // Handle unfollow logic
  };

  // Tabular view for desktop
  if (tabularView) {
    return (
      <Box sx={{ display: 'table-row' }}>
        <Box sx={{ 
          display: 'table-cell',
          verticalAlign: 'middle',
          py: 1.5,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 46, 
                height: 46,
                mr: 2,
                bgcolor: (theme) => theme.palette.primary.main,
                color: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                fontSize: '0.95rem',
                fontWeight: 600
              }}
            >
              {firstName.charAt(0)}{lastName.charAt(0)}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                {firstName} {lastName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isMutual && (
                  <Chip 
                    label="Mutual" 
                    size="small" 
                    color="primary"
                    variant="outlined"
                    sx={{ 
                      height: 22, 
                      fontSize: '0.7rem',
                      mr: 1,
                      fontWeight: 500,
                      border: '1px solid',
                      borderColor: (theme) => alpha(theme.palette.primary.main, 0.5)
                    }}
                  />
                )}
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  @{firstName.toLowerCase()}_{lastName.toLowerCase()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'table-cell',
          verticalAlign: 'middle',
          py: 1.5,
          color: 'text.secondary',
          display: { xs: 'none', md: 'table-cell' }
        }}>
          <Typography variant="body2">
            {new Date(followDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'table-cell',
          verticalAlign: 'middle',
          py: 1.5,
          textAlign: 'right'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Tooltip title="View profile">
              <Button 
                size="small" 
                variant="outlined"
                onClick={handleViewProfile}
                sx={{ 
                  borderRadius: '8px',
                  minWidth: 0,
                  p: '6px 12px',
                  borderColor: 'divider',
                  color: 'text.primary'
                }}
              >
                View
              </Button>
            </Tooltip>
            <Tooltip title="Unfollow">
              <IconButton 
                size="small"
                onClick={handleUnfollow}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '8px',
                  color: 'text.secondary',
                  p: '6px'
                }}
              >
                <UserMinus size={18} strokeWidth={1.5} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    );
  }

  // Card view for mobile
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <Avatar 
          sx={{ 
            width: 50, 
            height: 50,
            mr: 2,
            bgcolor: (theme) => theme.palette.primary.main,
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '1rem',
            fontWeight: 600
          }}
        >
          {firstName.charAt(0)}{lastName.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
            {firstName} {lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            @{firstName.toLowerCase()}_{lastName.toLowerCase()}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mt: 1.5
      }}>
        <Box>
          {isMutual && (
            <Chip 
              label="Mutual" 
              size="small" 
              color="primary"
              variant="outlined"
              sx={{ 
                height: 24, 
                fontSize: '0.75rem',
                mr: 1,
                fontWeight: 500
              }}
            />
          )}
          <Typography variant="caption" color="text.secondary">
            Since {new Date(followDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short'
            })}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={handleViewProfile}
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            View
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
*/

export default FollowerList;