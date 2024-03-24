import React, { ReactElement, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Alert, Box, IconButton, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ReplayIcon from '@mui/icons-material/Replay';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import { IUser } from '../types';

type IProps = {
  onCapture: (img: string) => void;
  user: IUser | undefined;
};

function WebCamComponent(props: IProps): ReactElement {
  const { onCapture, user } = props;
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const takeImage = () => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  };

  const resetState = (): void => {
    if (imgSrc !== undefined) {
      setImgSrc(undefined);
    }
    if (error !== undefined) {
      setError(undefined);
    }
  };

  const renderActionButtons = (): ReactElement => {
    if (imgSrc === undefined) {
      return (
        <Grid2 container justifyContent="center" alignItems="center">
          <Grid2 md={12} sm={12}>
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
      );
    }

    return (
      <Grid2 container justifyContent="center" alignItems="center" spacing={2}>
        <Grid2 md={6} sm={12}>
          <IconButton
            onClick={() => resetState()}
            size="large"
            color="error"
            aria-label="camera"
          >
            <ReplayIcon sx={{ fontSize: '50px' }} />
          </IconButton>
        </Grid2>
        <Grid2 md={6} sm={12}>
          <IconButton
            onClick={() => onCapture(imgSrc)}
            size="large"
            color="success"
            aria-label="camera"
          >
            <DoneOutlinedIcon sx={{ fontSize: '50px' }} />
          </IconButton>
        </Grid2>
      </Grid2>
    );
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
      {error !== undefined ? (
        <Alert severity="error" onClose={() => resetState()}>
          {error || ''}
        </Alert>
      ) : null}
      <Box border={0.5} borderColor="#707070">
        {imgSrc !== undefined ? (
          <Box
            sx={{ width: 450, height: 450 }}
            justifyContent="center"
            alignItems="center"
            display="flex"
          >
            <img src={imgSrc} width={450} height={350} alt="taken-pic" />
          </Box>
        ) : (
          <Webcam
            height={450}
            width={450}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            onUserMedia={() => {
              setShowButtons(true);
            }}
            onUserMediaError={(err) => {
              console.log(err);
              setError(err.toString());
            }}
          />
        )}
      </Box>
      {showButtons ? renderActionButtons() : null}
    </Box>
  );
}

export default WebCamComponent;
