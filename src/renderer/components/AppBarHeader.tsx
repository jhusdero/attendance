import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import HomeIcon from '@mui/icons-material/Home';

function AppBarHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showBackButton, setShowBackButton] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('Home');
  useEffect(() => {
    if (location?.pathname !== '/') {
      setShowBackButton(true);
      if (location?.pathname === '/check-in') {
        setTitle('Check In');
      }
      if (location?.pathname === '/check-out') {
        setTitle('Check Out');
      }
    } else {
      if (showBackButton) {
        setShowBackButton(false);
      }
      if (title !== 'Home') {
        setTitle('Home');
      }
    }
  }, [location]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#424242' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="burger"
            sx={{ mr: 2 }}
            onClick={() => navigate(-1)}
          >
            {showBackButton ? <ArrowBackIosNewIcon /> : <HomeIcon />}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title || 'Home'}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default AppBarHeader;
