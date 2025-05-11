import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  Tooltip, 
  Badge, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  useMediaQuery, 
  useTheme,
  Divider,
  Fab,
  Backdrop,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  Chip
} from "@mui/material";
import { 
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Explore as ExploreIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  Logout as LogoutIcon,
  TrackChanges,
  NotificationsNone,
  Person,
  KeyboardArrowDown,
  Menu as MenuIcon,
  Close as CloseIcon,
  Add as AddIcon,
  FiberManualRecord,
  HelpOutline as HelpIcon,
  Keyboard as ShortcutsIcon
} from "@mui/icons-material";
import { Share as ShareIcon, User as UserIcon } from "lucide-react";
import '@fontsource/lily-script-one';

function NewsFeed() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [helpMenuAnchor, setHelpMenuAnchor] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'follow', title: 'Chef Michael followed you', time: '5 minutes ago', read: false },
    { id: 2, type: 'like', title: 'Your recipe got 15 new likes', time: '2 hours ago', read: false },
    { id: 3, type: 'comment', title: 'New comment on your post', time: '1 day ago', read: true }
  ]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  
  const firstName = localStorage.getItem("psnUserFirstName") || "";
  const lastName = localStorage.getItem("psnUserLastName") || "";
  const initials = firstName && lastName 
    ? `${firstName.charAt(0)}${lastName.charAt(0)}` 
    : "U";

  const showNotification = (message, severity = 'success') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setShowToast(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("psnUserId");
    localStorage.removeItem("psnToken");
    localStorage.removeItem("psnUserFirstName");
    localStorage.removeItem("psnUserLastName");
    localStorage.removeItem("psnUserEmail");
    showNotification('Successfully signed out', 'info');
    setTimeout(() => navigate("/s"), 1000);
  };
  
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };
  
  const handleHelpMenuOpen = (event) => {
    setHelpMenuAnchor(event.currentTarget);
  };
  
  const handleHelpMenuClose = () => {
    setHelpMenuAnchor(null);
  };
  
  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => document.getElementById('main-search')?.focus(), 100);
    }
  };
  
  const isActive = (path) => {
    return location.pathname === "/s" + path;
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
  }, [navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === 'Escape' && searchOpen) {
        toggleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [searchOpen]);

  const navigationItems = [
    { path: "", icon: <HomeIcon fontSize="medium" />, label: "Home", color: '#4caf50' },
    { path: "myprofile", icon: <UserIcon size={24} />, label: "My Profile", color: '#2196f3' },
    { path: "dashboard", icon: <DashboardIcon fontSize="medium" />, label: "Dashboard", color: '#ff9800' },
    { path: "progress", icon: <TrackChanges />, label: "Progress", color: '#9c27b0' },
    { path: "all", icon: <ExploreIcon fontSize="medium" />, label: "Discover", color: '#f44336' },
    { path: "education", icon: <ShareIcon size={24} />, label: "Share", color: '#00bcd4' }
  ];
  
  const mobileDrawer = (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer}
      sx={{
        '& .MuiDrawer-paper': {
          background: 'linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%)',
        }
      }}
    >
      <Box sx={{ width: 280, pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 3 }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontFamily: '"Lily Script One", cursive',
              fontSize: '1.8rem',
              color: '#1565c0',
            }}
          >
            Skill Connect
          </Typography>
          <IconButton onClick={toggleMobileDrawer} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List>
          {navigationItems.map((item) => (
            <ListItem 
              button 
              key={item.path}
              component={Link}
              to={item.path}
              onClick={toggleMobileDrawer}
              sx={{ 
                bgcolor: isActive(item.path) ? `${item.color}15` : 'transparent',
                borderRadius: '12px',
                mb: 0.5,
                mx: 2,
                '&:hover': {
                  bgcolor: `${item.color}08`,
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive(item.path) ? item.color : '#616161',
                minWidth: '48px',
                transition: 'color 0.2s ease'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ 
                      color: isActive(item.path) ? item.color : 'inherit',
                      fontWeight: isActive(item.path) ? 600 : 400,
                      fontSize: '0.95rem'
                    }}>
                      {item.label}
                    </Typography>
                    {isActive(item.path) && (
                      <FiberManualRecord sx={{ fontSize: 8, color: item.color }} />
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
          
          <Divider sx={{ my: 2, mx: 2 }} />
          
          <ListItem 
            button 
            component={Link}
            to="/help"
            onClick={toggleMobileDrawer}
            sx={{ 
              borderRadius: '12px',
              mb: 0.5,
              mx: 2,
              color: '#757575'
            }}
          >
            <ListItemIcon sx={{ color: '#757575', minWidth: '48px' }}>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItem>
          
          <ListItem 
            button 
            sx={{ 
              borderRadius: '12px',
              mb: 0.5,
              mx: 2,
              mt: 2,
              color: '#f44336',
              '&:hover': {
                bgcolor: '#ffebee',
              }
            }}
            onClick={handleSignOut}
          >
            <ListItemIcon sx={{ color: '#f44336', minWidth: '48px' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  const notificationsMenu = (
    <Menu
      anchorEl={notificationsAnchor}
      open={Boolean(notificationsAnchor)}
      onClose={handleNotificationsClose}
      PaperProps={{
        elevation: 8,
        sx: { 
          width: 360, 
          maxHeight: 500, 
          mt: 1.5, 
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.05)'
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
        <Typography variant="h6" sx={{ 
          px: 3, 
          py: 2, 
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Notifications
          {unreadCount > 0 && (
            <Chip 
              label={`${unreadCount} new`} 
              size="small" 
              color="primary"
              sx={{ fontSize: '0.75rem', height: 24 }}
            />
          )}
        </Typography>
      </Box>
      
      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {notifications.map((notification) => (
          <MenuItem 
            key={notification.id}
            onClick={() => markNotificationAsRead(notification.id)}
            sx={{ 
              py: 2,
              px: 3,
              bgcolor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.04)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.02)'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
              <Avatar sx={{ 
                bgcolor: notification.type === 'follow' ? '#e3f2fd' : '#e8f5e9', 
                color: notification.type === 'follow' ? '#1976d2' : '#2e7d32', 
                width: 44, 
                height: 44, 
                mr: 2 
              }}>
                {notification.type === 'follow' ? <UserIcon size={22} /> : <Person fontSize="medium" />}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ 
                  fontWeight: notification.read ? 400 : 600,
                  fontSize: '0.95rem'
                }}>
                  {notification.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {notification.time}
                  </Typography>
                  {!notification.read && (
                    <FiberManualRecord sx={{ fontSize: 8, color: 'primary.main', ml: 1 }} />
                  )}
                </Box>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Box>
      
      <Divider />
      <Box sx={{ p: 1.5, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.01)' }}>
        <Typography 
          component={Link} 
          to="/notifications" 
          variant="body2" 
          color="primary" 
          sx={{ 
            textDecoration: 'none',
            fontWeight: 500,
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          View all notifications
        </Typography>
      </Box>
    </Menu>
  );

  const profileMenu = (
    <Menu
      anchorEl={profileMenuAnchor}
      open={Boolean(profileMenuAnchor)}
      onClose={handleProfileMenuClose}
      PaperProps={{
        elevation: 8,
        sx: { 
          width: 240, 
          mt: 1.5, 
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.05)'
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {firstName} {lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Online • Member since 2024
        </Typography>
      </Box>
      
      <MenuItem component={Link} to="myprofile" onClick={handleProfileMenuClose}>
        <Person fontSize="small" sx={{ mr: 2, color: '#2196f3' }} />
        My Profile
      </MenuItem>
      
      <MenuItem component={Link} to="settings" onClick={handleProfileMenuClose}>
        <SettingsIcon fontSize="small" sx={{ mr: 2, color: '#757575' }} />
        Settings & Privacy
      </MenuItem>
      
      <MenuItem onClick={handleHelpMenuOpen}>
        <ShortcutsIcon fontSize="small" sx={{ mr: 2, color: '#757575' }} />
        Keyboard Shortcuts
      </MenuItem>
      
      <Divider sx={{ my: 1 }} />
      
      <MenuItem onClick={handleSignOut} sx={{ color: '#f44336' }}>
        <LogoutIcon fontSize="small" sx={{ mr: 2 }} />
        Sign Out
      </MenuItem>
    </Menu>
  );

  const helpMenu = (
    <Menu
      anchorEl={helpMenuAnchor}
      open={Boolean(helpMenuAnchor)}
      onClose={handleHelpMenuClose}
      PaperProps={{
        elevation: 4,
        sx: { borderRadius: '12px', minWidth: 320 }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Keyboard Shortcuts
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use these shortcuts to navigate faster
        </Typography>
        <Box sx={{ '& > div': { mb: 1, display: 'flex', justifyContent: 'space-between' } }}>
          <Box>
            <Typography component="span" variant="body2">Search</Typography>
            <Typography component="span" variant="body2" sx={{ bgcolor: '#f5f5f5', px: 1, py: 0.5, borderRadius: 1, ml: 2 }}>⌘K</Typography>
          </Box>
          <Box>
            <Typography component="span" variant="body2">Home</Typography>
            <Typography component="span" variant="body2" sx={{ bgcolor: '#f5f5f5', px: 1, py: 0.5, borderRadius: 1, ml: 2 }}>G H</Typography>
          </Box>
          <Box>
            <Typography component="span" variant="body2">Profile</Typography>
            <Typography component="span" variant="body2" sx={{ bgcolor: '#f5f5f5', px: 1, py: 0.5, borderRadius: 1, ml: 2 }}>G P</Typography>
          </Box>
        </Box>
      </Box>
    </Menu>
  );

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 }, pb: 4 }}>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          color: '#1565c0',
          borderRadius: { xs: 0, md: '16px' },
          mt: { xs: 0, md: 2 },
          transition: 'all 0.3s ease',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 3 }, py: 1 }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={toggleMobileDrawer}
              sx={{ 
                p: 1.5,
                mr: 1,
                borderRadius: '12px',
                '&:hover': {
                  bgcolor: 'rgba(21, 101, 192, 0.08)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {/* Logo/Title */}
          <Typography 
            variant="h6" 
            component={Link}
            to="/s"
            sx={{ 
              fontFamily: '"Lily Script One", cursive',
              fontSize: '1.8rem',
              textDecoration: "none", 
              color: "inherit",
              display: 'flex',
              alignItems: 'center',
              flexGrow: { xs: 1, md: 0 },
              '&:hover': {
                color: '#1976d2',
              },
              transition: 'color 0.2s ease'
            }}
          >
            Skill Connect
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 0.5, mx: 4, flexGrow: 1, justifyContent: 'center' }}>
              {navigationItems.map((item) => (
                <Tooltip title={item.label} key={item.path} arrow>
                  <IconButton 
                    color="inherit" 
                    component={Link} 
                    to={item.path}
                    sx={{
                      bgcolor: isActive(item.path) ? `${item.color}15` : 'transparent',
                      color: isActive(item.path) ? item.color : 'inherit',
                      '&:hover': {
                        bgcolor: `${item.color}12`,
                        color: item.color,
                        transform: 'translateY(-2px)',
                      },
                      borderRadius: '12px',
                      mx: 0.5,
                      p: 1.5,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          )}

          {/* Right Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Search */}
            <IconButton 
              color="inherit" 
              onClick={toggleSearch}
              sx={{ 
                p: 1.5,
                borderRadius: '12px',
                '&:hover': {
                  bgcolor: 'rgba(21, 101, 192, 0.08)',
                },
              }}
            >
              <SearchIcon />
            </IconButton>
            
            {/* Help */}
            <IconButton 
              color="inherit" 
              onClick={handleHelpMenuOpen}
              sx={{ 
                p: 1.5,
                borderRadius: '12px',
                '&:hover': {
                  bgcolor: 'rgba(21, 101, 192, 0.08)',
                },
              }}
            >
              <HelpIcon />
            </IconButton>
            
            {/* Notifications */}
            <IconButton 
              color="inherit" 
              onClick={handleNotificationsOpen} 
              sx={{ 
                p: 1.5,
                borderRadius: '12px',
                bgcolor: Boolean(notificationsAnchor) ? 'rgba(21, 101, 192, 0.08)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(21, 101, 192, 0.08)',
                },
              }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsNone />
              </Badge>
            </IconButton>
            
            {/* User Profile */}
            <IconButton 
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ 
                ml: 1,
                border: '2px solid rgba(21, 101, 192, 0.15)',
                borderRadius: '12px',
                padding: '6px 12px',
                '&:hover': {
                  bgcolor: 'rgba(21, 101, 192, 0.04)',
                  borderColor: 'rgba(21, 101, 192, 0.3)',
                },
                bgcolor: Boolean(profileMenuAnchor) ? 'rgba(21, 101, 192, 0.04)' : 'transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: '#1565c0', 
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                {initials}
              </Avatar>
              {!isMobile && (
                <>
                  <Typography variant="body2" sx={{ ml: 1.5, fontWeight: 'medium' }}>
                    {firstName}
                  </Typography>
                  <KeyboardArrowDown fontSize="small" sx={{ ml: 0.5, color: 'rgba(0,0,0,0.4)' }} />
                </>
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Search Overlay */}
      <Backdrop
        open={searchOpen}
        onClick={toggleSearch}
        sx={{ zIndex: 1300, bgcolor: 'rgba(0,0,0,0.7)' }}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: '90%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            borderRadius: '16px',
            p: 2,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}
        >
          <TextField
            id="main-search"
            fullWidth
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" color="text.secondary">
                    ⌘K
                  </Typography>
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                bgcolor: 'rgba(0,0,0,0.03)'
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            Type to search across all content...
          </Typography>
        </Box>
      </Backdrop>
      
      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1200,
          bgcolor: '#1565c0',
          '&:hover': {
            bgcolor: '#1976d2',
          },
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 16px rgba(21, 101, 192, 0.3)',
        }}
        onClick={() => showNotification('Quick action would go here!')}
      >
        <AddIcon />
      </Fab>
      
      {/* Toast Notification */}
      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowToast(false)}
          severity={toastSeverity}
          sx={{ width: '100%', borderRadius: '12px' }}
          variant="filled"
        >
          {toastMessage}
        </Alert>
      </Snackbar>
      
      {mobileDrawer}
      {profileMenu}
      {notificationsMenu}
      {helpMenu}
      
      <Box sx={{ mt: 3, px: { xs: 2, sm: 0 } }}>
        <Outlet />
      </Box>
    </Container>
  );
}

export default NewsFeed;