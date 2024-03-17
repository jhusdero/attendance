import React, { ReactElement } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Box, Button, Typography } from '@mui/material';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import NorthEastSharp from '@mui/icons-material/NorthEastSharp';
import SouthWestSharp from '@mui/icons-material/SouthWestSharp';
import AddIcon from '@mui/icons-material/Add';

function Home(): ReactElement {
  const navigate: NavigateFunction = useNavigate();
  return (
    <Box>
      <Grid2
        container
        spacing={3}
        alignItems="flex-end"
        justifyContent="center"
        display="flex"
        sx={{ minHeight: '40vh' }}
      >
        <Grid2>
          <Button
            variant="contained"
            sx={{
              width: 270,
              height: 140,
              backgroundColor: '#cccccc',
              '&:hover': {
                backgroundColor: '#bfbfbf',
              },
            }}
            onClick={() => navigate('/check-in')}
            startIcon={<NorthEastSharp htmlColor="#333333" />}
          >
            <Typography variant="h5" color="#333333" sx={{ fontWeight: 900 }}>
              Check In
            </Typography>
          </Button>
        </Grid2>
        <Grid2>
          <Button
            variant="contained"
            sx={{
              width: 270,
              height: 140,
              backgroundColor: '#dddddd',
              '&:hover': {
                backgroundColor: '#cccccc',
              },
            }}
            onClick={() => navigate('/check-out')}
            endIcon={<SouthWestSharp htmlColor="#333333" />}
          >
            <Typography variant="h5" color="#333333" sx={{ fontWeight: 900 }}>
              Check Out
            </Typography>
          </Button>
        </Grid2>
      </Grid2>
      <Grid2
        container
        alignItems="center"
        justifyContent="center"
        display="flex"
        sx={{ minHeight: '20vh' }}
      >
        <Grid2
          mt={2}
          mx={3}
          sm={12}
          md={3}
          p={3}
          alignItems="center"
          justifyContent="center"
          display="flex"
          border={1}
          sx={{ borderStyle: 'dashed' }}
        >
          <Box>
            <Button variant="text" startIcon={<AddIcon />}>
              <Typography variant="body2" sx={{ fontWeight: 900 }}>
                Register
              </Typography>
            </Button>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default Home;
