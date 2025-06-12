import React, { useRef, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'; // Add useNavigate
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useTheme,
  TextField,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ArticleIcon from '@mui/icons-material/Article';

const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Users', icon: <PeopleIcon />, path: '/dashboard/users' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/dashboard/reports' },
  { text: 'Article', icon: <ArticleIcon />, path: '/dashboard/articles' },
];

const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/dashboard/users':
      return 'Users';
    case '/dashboard/reports':
      return 'Reports';
      case '/dashboard/articles':
      return 'Article';
    default:
      return 'Welcome';
  }
};

const DashLayout = () => {
  const [open, setOpen] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(240);
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const isResizing = useRef(false);

  const pageTitle = getPageTitle(location.pathname);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const startResize = () => {
    isResizing.current = true;
  };

  const stopResize = () => {
    isResizing.current = false;
  };

  const resizeDrawer = (e) => {
    if (isResizing.current) {
      const newWidth = e.clientX;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setDrawerWidth(newWidth);
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener('mousemove', resizeDrawer);
    window.addEventListener('mouseup', stopResize);
    return () => {
      window.removeEventListener('mousemove', resizeDrawer);
      window.removeEventListener('mouseup', stopResize);
    };
  }, []);

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing user session)
    // Navigate to the home page after logout
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1976d2',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {pageTitle}
          </Typography>

          {/* Search Field */}
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: 'white',
              borderRadius: 1,
              width: 250,
              input: { padding: '8px 10px' },
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Menu</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />

        {/* Navigation */}
        <List sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                width: '100%',
                backgroundColor:
                  location.pathname === item.path ? '#e3f2fd' : 'transparent',
              }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 2,
                  color: location.pathname === item.path ? '#1976d2' : 'inherit',
                }}
              >
                <ListItemIcon sx={{ minWidth: 'auto', mb: 1 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 12,
                    textAlign: 'center',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Logout at bottom */}
        <List sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 'auto', mb: 2 }}>
          <ListItem disablePadding sx={{ width: '100%', justifyContent: 'center' }}>
            <ListItemButton
              onClick={handleLogout} // Updated to call handleLogout
              sx={{
                flexDirection: 'column',
                alignItems: 'center',
                py: 2,
                color: 'red',
                '&:hover': {
                  backgroundColor: '#fbe9e7',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', mb: 1, color: 'red' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontSize: 12, textAlign: 'center' }}
              />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Resize Handle */}
        <Box
          sx={{
            width: '5px',
            cursor: 'col-resize',
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 1201,
          }}
          onMouseDown={startResize}
        />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: open ? `${drawerWidth}px` : 0,
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashLayout;
