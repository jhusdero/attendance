import React, { ReactElement, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Alert, Box, IconButton, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { IUser } from '../types';

type IProps = {
  onCapture: (img: string) => void;
  user: IUser | undefined;
};

function WebCamComponent(props: IProps): ReactElement {
  const { onCapture, user } = props;
  const webcamRef = useRef(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const takeImage = () => {
    const imageSrc = webcamRef?.current.getScreenshot();
    onCapture(imageSrc);
  };

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
    >
      <Grid2 container>
        <Grid2 p={5}>
          <Typography variant="body1">
            Hey <b>{user?.name || ''}</b>, please look into the camera and press
            the camera icon
          </Typography>
        </Grid2>
      </Grid2>
      {error && <Alert severity="error">{error || ''}</Alert>}
      <Box border={0.5} borderColor="#707070">
        <Webcam
          height={450}
          width={450}
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          onUserMedia={(val) => {
            console.log(val);
          }}
          onUserMediaError={(err) => {
            console.log(err);
            setError(err.toString());
          }}
        />
      </Box>
      <Grid2 container justifyContent="center" alignItems="center">
        <Grid2>
          <IconButton
            onClick={() => takeImage()}
            size="large"
            color="inherit"
            aria-label="camera"
          >
            <CameraAltIcon sx={{ fontSize: '70px' }} />
          </IconButton>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default WebCamComponent;
