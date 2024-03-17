import React, { ReactElement } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { IUser } from '../types';
import { getCurrentDateTime } from '../utils';

interface IProps {
  image: string;
  userInfo: IUser | undefined;
  action: number;
}

function SuccessComponent(props: IProps): ReactElement {
  const { image, userInfo, action } = props;
  const navigate: NavigateFunction = useNavigate();

  const renderUserDetails = (): ReactElement => {
    return (
      <>
        <Grid2 container p={1}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Name:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="h7" fontWeight="bold">
              {userInfo?.name || ''}
            </Typography>
          </Grid2>
        </Grid2>
        <Grid2 container p={1}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Code:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="h7" fontWeight="bold">
              {userInfo?.code || ''}
            </Typography>
          </Grid2>
        </Grid2>
        <Grid2 container p={1}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Activity:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="h7" fontWeight="bold">
              {action === 0 ? 'Check IN' : 'Check Out'}
            </Typography>
          </Grid2>
        </Grid2>
        <Grid2 container p={1}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Time:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="h7" fontWeight="bold">
              {getCurrentDateTime()}
            </Typography>
          </Grid2>
        </Grid2>
      </>
    );
  };

  return (
    <Box sx={{ py: 10, px: 20 }}>
      <Grid2 container spacing={4} display="flex">
        <Grid2 sm={12} md={6}>
          <Card
            elevation={5}
            sx={{
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Grid2 pt={5} container display="flex" justifyContent="center">
                <Grid2
                  sm={12}
                  md={12}
                  justifyContent="center"
                  display="flex"
                  mb={5}
                >
                  <img
                    src={require('../../assets/img/success.png')}
                    alt="success"
                    width={80}
                    height={80}
                  />
                </Grid2>
                <Grid2 sm={12} md={12} mb={10}>
                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      sx={{
                        backgroundColor: '#fff',
                        border: '1px solid rgba(0, 0, 0, .125)',
                      }}
                    >
                      <Typography>User Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        borderTop: '1px solid rgba(0, 0, 0, .125)',
                        backgroundColor: '#f8f8f8',
                      }}
                    >
                      {renderUserDetails()}
                    </AccordionDetails>
                  </Accordion>
                </Grid2>
                <Grid2 container display="flex" justifyContent="center">
                  <Button
                    color="success"
                    variant="contained"
                    onClick={() => navigate('/')}
                  >
                    DONE
                  </Button>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 sm={12} md={6}>
          <Card
            elevation={5}
            sx={{
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Grid2 pt={5} container display="flex" justifyContent="center">
                <img src={image} alt="user-image" width={500} height={400} />
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default SuccessComponent;
