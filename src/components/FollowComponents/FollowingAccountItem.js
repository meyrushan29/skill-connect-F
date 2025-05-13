import React, { useState, useEffect } from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfileId } from "../../feature/checkProfile/checkProfileSlice";
import { unfollowAccount } from "../../feature/followingAccounts/followingAccountSlice";
import { 
  Check, 
  X, 
  MessageCircle, 
  User, 
  Calendar, 
  Users,
  BadgeCheck,
  ChevronRight,
  Bell,
  Heart
} from "lucide-react";

// MUI imports for enhanced UI
import { 
  Box, 
  Typography, 
  Button, 
  Avatar, 
  Paper, 
  Chip, 
  IconButton, 
  Tooltip, 
  Fade, 
  Badge,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';

function FollowingAccountItem(props) {
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const selectedProfileId = useSelector(
    (state) => state.checkProfileReducer.profileId
  );
  
  const [unfollowStatus, setUnfollowStatus] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Extract all props for easier access
  const { 
    id, 
    firstName, 
    lastName, 
    followDate, 
    bio, 
    isMutual = false, 
    joinDate, 
    tabularView = true,
    isActive = false,
    isVerified = false,
    skills = [],
    profession = "",
    mutualConnections = 0,
    lastActivity = "2 hours ago"
  } = props;

  // Format the full name
  const fullName = `${firstName} ${lastName}`;
  // Generate username from first and last name
  const username = `@${firstName.toLowerCase()}${lastName.toLowerCase()}`;

  function handleFollowButtonClick(e) {
    e.preventDefault(); // Prevent parent link click
    e.stopPropagation(); // Stop event bubbling
    
    // Show confirmation dialog
    setConfirmDialogOpen(true);
  }
  
  function confirmUnfollow() {
    dispatch(
      unfollowAccount({
        followedId: id,
        followerId: localStorage.getItem("psnUserId"),
      })
    );
    setUnfollowStatus(true);
    setConfirmDialogOpen(false);
  }
  
  function handleViewProfile(e) {
    dispatch(getProfileId(id));
  }
  
  const handleMenuOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // If tabular view is requested (for table layouts)
  if (tabularView) {
    return (
      <>
        <Box 
          component="tr"
          sx={{
            backgroundColor: isHovered 
              ? alpha(theme.palette.primary.main, 0.05)
              : alpha(theme.palette.primary.main, 0.02),
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08)
            },
            borderRadius: '12px',
            height: '80px'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Box 
            component="td"
            sx={{ 
              p: 1.5,
              pl: 2,
              borderTopLeftRadius: '12px',
              borderBottomLeftRadius: '12px',
              verticalAlign: 'middle',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  isVerified ? (
                    <Tooltip title="Verified Account" placement="top">
                      <Avatar 
                        sx={{ 
                          width: 16, 
                          height: 16, 
                          bgcolor: '#1976d2',
                          border: '1.5px solid #fff'
                        }}
                      >
                        <BadgeCheck size={12} color="#fff" />
                      </Avatar>
                    </Tooltip>
                  ) : null
                }
              >
                <Box
                  sx={{
                    borderRadius: '50%',
                    p: 0.5,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: isActive ? '2px solid #4caf50' : 'none',
                    position: 'relative',
                    boxSizing: 'content-box'
                  }}
                >
                  <Hashicon value={id} size={48} />
                  
                  {isActive && (
                    <Tooltip title="Currently Active">
                      <Box
                        sx={{
                          position: 'absolute',
                          width: 10,
                          height: 10,
                          bgcolor: '#4caf50',
                          borderRadius: '50%',
                          bottom: 5,
                          right: 5,
                          border: '1.5px solid #fff'
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>
              </Badge>
              
              <Box sx={{ ml: 2 }}>
                <Typography 
                  component={Link}
                  to="/newsfeed/profile"
                  onClick={handleViewProfile}
                  variant="subtitle1"
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.primary.dark,
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.primary.main,
                      textDecoration: 'underline'
                    },
                    fontSize: '0.95rem',
                    display: 'block',
                    mb: 0.5
                  }}
                >
                  {fullName}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                  {isMutual && (
                    <Chip 
                      label="Mutual" 
                      size="small" 
                      color="primary"
                      variant="outlined"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem',
                        mr: 1,
                        fontWeight: 500,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.5)
                      }}
                    />
                  )}
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {username}
                  </Typography>
                </Box>
                
                {profession && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '0.75rem',
                      display: { xs: 'none', md: 'flex' },
                      alignItems: 'center',
                      mt: 0.5
                    }}
                  >
                    {profession}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          
          <Box
            component="td"
            sx={{ 
              p: 2,
              verticalAlign: 'middle',
              color: 'text.secondary',
              display: { xs: 'none', md: 'table-cell' }
            }}
          >
            {followDate && (
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Calendar size={14} style={{ marginRight: 6, opacity: 0.7 }} />
                Following since {new Date(followDate || Date.now()).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Typography>
            )}
            
            {!followDate && lastActivity && (
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Calendar size={14} style={{ marginRight: 6, opacity: 0.7 }} />
                Active {lastActivity}
              </Typography>
            )}
            
            {mutualConnections > 0 && (
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  mt: 0.75
                }}
              >
                <Users size={14} style={{ marginRight: 6, opacity: 0.7 }} />
                {mutualConnections} mutual connection{mutualConnections > 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
          
          <Box
            component="td"
            sx={{ 
              p: 2,
              pr: 3,
              verticalAlign: 'middle',
              textAlign: 'right',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Tooltip title="View profile">
                <Button
                  variant="outlined"
                  component={Link}
                  to="/newsfeed/profile"
                  onClick={handleViewProfile}
                  sx={{ 
                    borderRadius: '10px',
                    minWidth: 0,
                    px: 2,
                    py: 0.75,
                    borderColor: theme.palette.divider,
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                  endIcon={<ChevronRight size={14} />}
                >
                  View
                </Button>
              </Tooltip>
              
              <Tooltip title="Options">
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ 
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    p: '6px',
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </IconButton>
              </Tooltip>
              
              <Button
                variant="outlined"
                color="error"
                onClick={handleFollowButtonClick}
                disabled={unfollowStatus}
                startIcon={unfollowStatus ? <Check size={16} /> : <X size={16} />}
                sx={{
                  borderRadius: '10px',
                  py: 0.75,
                  px: unfollowStatus ? 1.5 : 2,
                  borderColor: unfollowStatus ? theme.palette.divider : alpha(theme.palette.error.main, 0.5),
                  color: unfollowStatus ? theme.palette.text.disabled : theme.palette.error.main,
                  '&:hover': {
                    bgcolor: unfollowStatus ? 'transparent' : alpha(theme.palette.error.main, 0.04),
                    borderColor: unfollowStatus ? theme.palette.divider : theme.palette.error.main
                  },
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {unfollowStatus ? 'Unfollowed' : 'Unfollow'}
              </Button>
            </Box>
          </Box>
        </Box>
        
        {/* Options Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            elevation: 3,
            sx: { 
              minWidth: 200,
              borderRadius: '12px', 
              mt: 1,
              overflow: 'hidden'
            }
          }}
        >
          <MenuItem onClick={handleMenuClose} dense>
            <ListItemIcon>
              <MessageCircle size={18} />
            </ListItemIcon>
            <ListItemText primary="Send message" />
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose} dense>
            <ListItemIcon>
              <Bell size={18} />
            </ListItemIcon>
            <ListItemText primary="Get notifications" />
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose} dense>
            <ListItemIcon>
              <Heart size={18} />
            </ListItemIcon>
            <ListItemText primary="Add to favorites" />
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleFollowButtonClick} dense sx={{ color: theme.palette.error.main }}>
            <ListItemIcon sx={{ color: theme.palette.error.main }}>
              <X size={18} />
            </ListItemIcon>
            <ListItemText primary="Unfollow" />
          </MenuItem>
        </Menu>
        
        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              maxWidth: 400
            }
          }}
        >
          <DialogTitle sx={{ pb: 1, pt: 3 }}>
            Unfollow {firstName}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              You'll no longer see posts from {firstName} in your feed. You can always follow them again later.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setConfirmDialogOpen(false)} 
              color="primary"
              sx={{ 
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmUnfollow} 
              variant="contained" 
              color="error"
              sx={{ 
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(244, 67, 54, 0.25)'
                }
              }}
            >
              Unfollow
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
  
  // Card view (for mobile or grid layouts)
  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          border: '1px solid',
          borderColor: theme.palette.divider,
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-4px)',
            borderColor: theme.palette.primary.main
          },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: alpha(theme.palette.primary.main, 0.02)
        }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Decorative top accent */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(to right, #1976d2, #42a5f5)'
          }}
        />
        
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <Tooltip title="Options">
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05)
                }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              isVerified ? (
                <Tooltip title="Verified Account">
                  <Avatar 
                    sx={{ 
                      width: 20, 
                      height: 20, 
                      bgcolor: '#1976d2',
                      border: '2px solid #fff'
                    }}
                  >
                    <BadgeCheck size={14} color="#fff" />
                  </Avatar>
                </Tooltip>
              ) : null
            }
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#f0f8ff',
                border: isActive ? '3px solid #4caf50' : '3px solid #f0f8ff',
                position: 'relative'
              }}
            >
              <Hashicon value={id} size={74} />
              
              {isActive && (
                <Tooltip title="Currently Active">
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 12,
                      height: 12,
                      bgcolor: '#4caf50',
                      borderRadius: '50%',
                      bottom: 5,
                      right: 5,
                      border: '2px solid #fff'
                    }}
                  />
                </Tooltip>
              )}
            </Avatar>
          </Badge>
          
          <Typography 
            component={Link}
            to="/newsfeed/profile"
            onClick={handleViewProfile}
            variant="h6"
            sx={{ 
              mt: 1.5,
              fontWeight: 600,
              color: theme.palette.primary.dark,
              textDecoration: 'none',
              textAlign: 'center',
              '&:hover': {
                color: theme.palette.primary.main,
                textDecoration: 'underline'
              }
            }}
          >
            {fullName}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mb: 1, 
              textAlign: 'center',
              fontSize: '0.85rem'
            }}
          >
            {username}
          </Typography>
          
          {profession && (
            <Chip 
              label={profession} 
              size="small"
              sx={{ 
                fontSize: '0.75rem', 
                mb: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main
              }}
            />
          )}
          
          {followDate && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.75rem',
                mb: 1
              }}
            >
              <Calendar size={12} style={{ marginRight: 4 }} />
              Following since {new Date(followDate || Date.now()).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
              })}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 'auto' }}>
          {mutualConnections > 0 && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 2 
            }}>
              <Users size={14} style={{ marginRight: 6, opacity: 0.7 }} />
              <Typography variant="caption" color="text.secondary">
                {mutualConnections} mutual connection{mutualConnections > 1 ? 's' : ''}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleFollowButtonClick}
              disabled={unfollowStatus}
              startIcon={unfollowStatus ? <Check size={16} /> : <X size={16} />}
              fullWidth
              sx={{
                borderRadius: '10px',
                py: 1,
                borderColor: unfollowStatus ? theme.palette.divider : alpha(theme.palette.error.main, 0.5),
                color: unfollowStatus ? theme.palette.text.disabled : theme.palette.error.main,
                '&:hover': {
                  bgcolor: unfollowStatus ? 'transparent' : alpha(theme.palette.error.main, 0.04),
                  borderColor: unfollowStatus ? theme.palette.divider : theme.palette.error.main
                },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {unfollowStatus ? 'Unfollowed' : 'Unfollow'}
            </Button>
            
            <Tooltip title="View profile">
              <IconButton
                component={Link}
                to="/newsfeed/profile"
                onClick={handleViewProfile}
                sx={{ 
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    color: theme.palette.primary.main
                  }
                }}
              >
                <User size={20} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Send message">
              <IconButton
                sx={{ 
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  color: 'text.secondary',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    color: theme.palette.primary.main
                  }
                }}
              >
                <MessageCircle size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
      
      {/* Options Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: { 
            minWidth: 200,
            borderRadius: '12px', 
            mt: 1,
            overflow: 'hidden'
          }
        }}
      >
        <MenuItem onClick={handleMenuClose} dense>
          <ListItemIcon>
            <MessageCircle size={18} />
          </ListItemIcon>
          <ListItemText primary="Send message" />
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose} dense>
          <ListItemIcon>
            <Bell size={18} />
          </ListItemIcon>
          <ListItemText primary="Get notifications" />
        </MenuItem>
        
        <MenuItem onClick={handleMenuClose} dense>
          <ListItemIcon>
            <Heart size={18} />
          </ListItemIcon>
          <ListItemText primary="Add to favorites" />
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleFollowButtonClick} dense sx={{ color: theme.palette.error.main }}>
          <ListItemIcon sx={{ color: theme.palette.error.main }}>
            <X size={18} />
          </ListItemIcon>
          <ListItemText primary="Unfollow" />
        </MenuItem>
      </Menu>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3 }}>
          Unfollow {firstName}?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You'll no longer see posts from {firstName} in your feed. You can always follow them again later.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setConfirmDialogOpen(false)} 
            color="primary"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmUnfollow} 
            variant="contained" 
            color="error"
            sx={{ 
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.25)'
              }
            }}
          >
            Unfollow
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FollowingAccountItem;