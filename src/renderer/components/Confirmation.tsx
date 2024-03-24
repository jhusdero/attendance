import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { IError, IUser } from '../types';
import { getCurrentDateTime } from '../utils';

interface IProps {
  image: string;
  userInfo: IUser | undefined;
  action: number;
  remarks?: string;
}

function Confirmation(props: IProps): ReactElement {
  const { image, userInfo, action, remarks } = props;
  const navigate: NavigateFunction = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const time: string = getCurrentDateTime();
  const [labelledImage, setLabelledImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError>({
    error: false,
    message: '',
  });
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef?.current;
    const img = imageRef?.current;
    if (canvas && img) {
      const ctx = canvas.getContext('2d');
      if (ctx === null) {
        return;
      }
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        ctx.font = '18px Courier';
        ctx.fillStyle = 'red';
        ctx.fillText(userInfo?.name || '', 10, 30);
        ctx.fillText(time, 10, 50);

        setLabelledImage(canvas.toDataURL());
      };
    }
  }, []);

  const processData = (): void => {
    try {
      setLoading(true);
      if (error.error) {
        setError({ error: false, message: '' });
      }
      // initiate to send to backend
      window.electron.ipcRenderer.sendMessage('send-to-backend', {
        user: userInfo,
        action,
        image: labelledImage,
        remarks,
      });

      // success
      window.electron.ipcRenderer.on('send-to-backend-done', (args) => {
        console.log(`Done:  ${args}`);
        setLoading(false);
        return setSuccess(true);
      });

      // failed
      window.electron.ipcRenderer.on('send-to-backend-failed', (args) => {
        setLoading(false);
        return setError({
          error: true,
          message: `Error processing data: ${args}`,
        });
      });
    } catch (e) {
      console.log(e);
      if (loading) {
        setLoading(false);
      }
      setError({
        error: true,
        message: `Oops something went wrong. ${e}`,
      });
    }
  };

  const renderUserDetails = (): ReactElement => {
    return (
      <>
        <Grid2 container p={1}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Name:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="body2" fontWeight="bold">
              {userInfo?.name || ''}
            </Typography>
          </Grid2>
        </Grid2>
        <Grid2 container p={1}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Code:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="body2" fontWeight="bold">
              {userInfo?.code || ''}
            </Typography>
          </Grid2>
        </Grid2>
        <Grid2 container p={1}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Activity:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="body2" fontWeight="bold">
              {action === 0 ? 'Check IN' : 'Check Out'}
            </Typography>
          </Grid2>
        </Grid2>
        <Grid2 container p={1}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Time:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="body2" fontWeight="bold">
              {time}
            </Typography>
          </Grid2>
        </Grid2>
        <Grid2 container p={1}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Remarks:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="body2" fontWeight="bold">
              {remarks}
            </Typography>
          </Grid2>
        </Grid2>
      </>
    );
  };

  const renderSuccessModal = (): ReactElement => {
    return (
      <Dialog
        open={success}
        onClose={() => navigate('/')}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <b>Successful</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Hey <b>{userInfo?.name || ''}</b> you have{' '}
            {action === 0 ? 'Checked IN ' : 'Checked OUT '}
            at <b>{time}</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/')}>Done</Button>
        </DialogActions>
      </Dialog>
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
              <Grid2 container display="flex" justifyContent="center">
                <Grid2
                  sm={12}
                  md={12}
                  justifyContent="center"
                  display="flex"
                  mb={1}
                >
                  <img
                    src={require('../../assets/img/attendance.png')}
                    alt="success"
                    width={80}
                    height={80}
                  />
                </Grid2>
              </Grid2>
              <Grid2 container>
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
              </Grid2>
              {error.error ? (
                <Grid2
                  container
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mb={3}
                >
                  <Grid2 sm={12} md={12}>
                    <Alert
                      severity="error"
                      onClose={() => setError({ error: false, message: '' })}
                    >
                      {error.message || ''}
                    </Alert>
                  </Grid2>
                </Grid2>
              ) : null}
              <Grid2
                container
                display="flex"
                justifyContent="center"
                spacing={2}
                alignItems="center"
              >
                <Grid2>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </Grid2>
                <Grid2>
                  <Button
                    disabled={loading}
                    color="success"
                    variant="contained"
                    onClick={() => processData()}
                  >
                    {loading ? 'Processing ...' : 'Submit'}
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
              <Grid2
                pt={5}
                container
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <canvas ref={canvasRef} width={500} height={400} />
                <img
                  ref={imageRef}
                  src={image}
                  alt="user-action-img"
                  style={{ display: 'none' }}
                />
              </Grid2>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      {renderSuccessModal()}
    </Box>
  );
}

export default Confirmation;
