import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
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
        <Container maxWidth="xl">
          <Toolbar>
            <Box
              alignItems="center"
              sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
            >
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
              <Typography variant="h6" component="div">
                {title || 'Home'}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Click here to update app data">
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Update
                </Button>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}

export default AppBarHeader;
