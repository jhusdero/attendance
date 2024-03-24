import React, { ReactElement, useEffect, useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import NorthEastSharp from '@mui/icons-material/NorthEastSharp';
import SouthWestSharp from '@mui/icons-material/SouthWestSharp';
import { IError, IReason, IDRequest, IUser, IDResponse } from '../types';
import LoadingOverlay from '../components/LoadingOverlay';

function Home(): ReactElement {
  const navigate: NavigateFunction = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [reasons, setReasons] = useState<IReason[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<IError>({
    error: false,
    message: '',
  });

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    fetchUsers();
  }, []);

  const fetchUsers = (): void => {
    try {
      setLoading(true);
      const reqData: IDRequest = {
        method: 'READ',
        type: 'USERS',
      };
      // fetch users
      window.electron.ipcRenderer.sendMessage('send-to-backend', reqData);
      // fetch done
      window.electron.ipcRenderer.on(
        'send-to-backend-done',
        (args: IDResponse | any) => {
          setLoading(false);
          const { code, message, data } = args;
          if (code === 0) {
            setUsers(data?.users || undefined);
            return setReasons(data?.reasons || []);
          }
          return setError({
            error: true,
            message: message || '001: Failed to get Users.',
          });
        },
      );
      // fetch failed
      window.electron.ipcRenderer.on(
        'send-to-backend-failed',
        (args: IDResponse | any) => {
          setLoading(false);
          return setError({
            error: true,
            message: `[${args?.code}]: ${
              args?.message || 'OOPS SOMETHING WENT WRONG'
            }`,
          });
        },
      );
    } catch (e) {
      if (loading) {
        setLoading(false);
      }
      setError({
        error: true,
        message: 'Oops something went wrong, try to click Update to try again',
      });
    }
  };

  return (
    <Box>
      {loading ? (
        <LoadingOverlay open={loading} handleClose={() => setLoading(false)} />
      ) : null}
      <Grid2
        container
        spacing={3}
        alignItems="flex-end"
        justifyContent="center"
        display="flex"
        mt={4}
        sx={{ minHeight: '40vh' }}
      >
        <Grid2>
          <Button
            variant="contained"
            sx={{
              width: 270,
              height: 140,
              backgroundColor: '#f4f4f5',
              '&:hover': {
                backgroundColor: '#bfbfbf',
              },
            }}
            onClick={() => navigate('/check-in', { state: { users, reasons } })}
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
              backgroundColor: '#f4f4f5',
              '&:hover': {
                backgroundColor: '#cccccc',
              },
            }}
            onClick={() =>
              navigate('/check-out', { state: { users, reasons } })
            }
            endIcon={<SouthWestSharp htmlColor="#333333" />}
          >
            <Typography variant="h5" color="#333333" sx={{ fontWeight: 900 }}>
              Check Out
            </Typography>
          </Button>
        </Grid2>
      </Grid2>
      {error.error ? (
        <Grid2 mt={5} container justifyContent="center" alignItems="center">
          <Grid2 md={6} sm={12}>
            <Alert
              severity="error"
              onClose={() => setError({ error: false, message: '' })}
            >
              <AlertTitle>Error</AlertTitle>
              {error.message || ''}
            </Alert>
          </Grid2>
        </Grid2>
      ) : null}
    </Box>
  );
}

export default Home;
