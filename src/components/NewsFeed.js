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
  useTheme 
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
  Menu as MenuIcon
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
  
  const firstName = localStorage.getItem("psnUserFirstName") || "";
  const lastName = localStorage.getItem("psnUserLastName") || "";
  const initials = firstName && lastName 
    ? `${firstName.charAt(0)}${lastName.charAt(0)}` 
    : "U";

  const handleSignOut = () => {
    localStorage.removeItem("psnUserId");
    localStorage.removeItem("psnToken");
    localStorage.removeItem("psnUserFirstName");
    localStorage.removeItem("psnUserLastName");
    localStorage.removeItem("psnUserEmail");
    navigate("/s");
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
  
  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === "/s" + path;
  };

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
  }, [navigate]);


  //New Feed Navigation Items Update 

  const navigationItems = [
    { path: "", icon: <HomeIcon fontSize="medium" />, label: "Home" },
    { path: "all", icon: <ExploreIcon fontSize="medium" />, label: "Discover" },
    { path: "progress", icon: <TrackChanges />, label: "Progress" },
    { path: "dashboard", icon: <DashboardIcon fontSize="medium" />, label: "Dashboard" },
    { path: "education", icon: <ShareIcon size={24} />, label: "Share" },
    { path: "myprofile", icon: <UserIcon size={24} />, label: "Profile" }
  ];
  
  const mobileDrawer = (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer}
    >
      <Box sx={{ width: 250, pt: 2, pb: 2 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontFamily: '"Lily Script One", cursive',
            fontSize: '1.5rem',
            textAlign: 'center',
            color: '#063970',
            mb: 3
          }}
        >
          Skill Connect
        </Typography>
        
        <List>
          {navigationItems.map((item) => (
            <ListItem 
              button 
              key={item.path}
              component={Link}
              to={item.path}
              onClick={toggleMobileDrawer}
              sx={{ 
                bgcolor: isActive(item.path) ? 'rgba(6, 57, 112, 0.08)' : 'transparent',
                borderRadius: '8px',
                mb: 0.5,
                mx: 1
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive(item.path) ? '#063970' : 'inherit',
                minWidth: '40px'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ color: isActive(item.path) ? '#063970' : 'inherit' }}
              />
            </ListItem>
          ))}
          <ListItem 
            button 
            sx={{ 
              borderRadius: '8px',
              mb: 0.5,
              mx: 1,
              mt: 2,
              color: '#f44336'
            }}
            onClick={handleSignOut}
          >
            <ListItemIcon sx={{ color: '#f44336', minWidth: '40px' }}>
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
        elevation: 3,
        sx: { width: 320, maxHeight: 450, mt: 1.5, borderRadius: '12px' }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Typography variant="h6" sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        Notifications
      </Typography>
      <MenuItem onClick={handleNotificationsClose} sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Avatar sx={{ bgcolor: '#e3f2fd', color: '#1976d2', width: 38, height: 38, mr: 2 }}>
            <UserIcon size={20} />
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Chef Michael followed you
            </Typography>
            <Typography variant="body2" color="text.secondary">
              5 minutes ago
            </Typography>
          </Box>
        </Box>
      </MenuItem>
      <MenuItem onClick={handleNotificationsClose} sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Avatar sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', width: 38, height: 38, mr: 2 }}>
            <Person fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Your recipe got 15 new likes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              2 hours ago
            </Typography>
          </Box>
        </Box>
      </MenuItem>
      <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.08)', p: 1, textAlign: 'center' }}>
        <Typography component={Link} to="/notifications" variant="body2" color="primary" sx={{ textDecoration: 'none' }}>
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
        elevation: 3,
        sx: { width: 200, mt: 1.5, borderRadius: '12px' }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem component={Link} to="myprofile" onClick={handleProfileMenuClose}>
        <Person fontSize="small" sx={{ mr: 1.5 }} />
        Profile
      </MenuItem>
      <MenuItem component={Link} to="settings" onClick={handleProfileMenuClose}>
        <SettingsIcon fontSize="small" sx={{ mr: 1.5 }} />
        Settings
      </MenuItem>
      <MenuItem onClick={handleSignOut} sx={{ color: '#f44336', mt: 1, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
        Sign Out
      </MenuItem>
    </Menu>
  );

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 }, pb: 4 }}>
      <AppBar 
        position="sticky" 
        elevation={1}
        sx={{
          background: 'white',
          color: '#063970',
          borderRadius: { xs: 0, md: '12px' },
          mt: { xs: 0, md: 2 },
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 2 } }}>
         
          
          {/* Logo/Title */}
          <Typography 
            variant="h6" 
            component={Link}
            to="/s"
            sx={{ 
              fontFamily: '"Lily Script One", cursive',
              fontSize: '1.5rem',
              textDecoration: "none", 
              color: "inherit",
              display: 'flex',
              alignItems: 'center',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            Skill Connect
          </Typography>


          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 0.5, mx: 2, flexGrow: 1, justifyContent: 'center' }}>
              {navigationItems.map((item) => (
                <Tooltip title={item.label} key={item.path}>
                  <IconButton 
                    color="inherit" 
                    component={Link} 
                    to={item.path}
                    sx={{
                      bgcolor: isActive(item.path) ? 'rgba(6, 57, 112, 0.08)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(6, 57, 112, 0.15)',
                      },
                      borderRadius: '12px',
                      mx: 0.5,
                      p: 1.2
                    }}
                  >
                    {item.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          )}

          {/* Right Actions */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Notifications */}
            <IconButton 
              color="inherit" 
              onClick={handleNotificationsOpen} 
              sx={{ 
                mr: 1,
                bgcolor: Boolean(notificationsAnchor) ? 'rgba(6, 57, 112, 0.08)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(6, 57, 112, 0.15)',
                },
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsNone />
              </Badge>
            </IconButton>
            
            {/* User Profile */}
            <Tooltip title="Account">
              <IconButton 
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ 
                  ml: 1,
                  border: '2px solid rgba(6, 57, 112, 0.2)',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  '&:hover': {
                    bgcolor: 'rgba(6, 57, 112, 0.04)',
                  },
                  bgcolor: Boolean(profileMenuAnchor) ? 'rgba(6, 57, 112, 0.04)' : 'transparent',
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: '#063970', 
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  {initials}
                </Avatar>
                {!isMobile && (
                  <>
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                      {firstName}
                    </Typography>
                    <KeyboardArrowDown fontSize="small" sx={{ ml: 0.5, color: 'rgba(0,0,0,0.5)' }} />
                  </>
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {mobileDrawer}
      {profileMenu}
      {notificationsMenu}
      
      <Box sx={{ mt: 3, px: { xs: 2, sm: 0 } }}>
        <Outlet />
      </Box>
    </Container>
  );
}

export default NewsFeed;