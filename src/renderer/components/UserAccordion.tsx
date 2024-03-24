import React, { ChangeEvent, ReactElement, useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { HourglassBottom } from '@mui/icons-material';
import { IFile, IReason, IUser } from '../types';
import { fileToBase64 } from '../utils';

interface IProps {
  user: IUser | undefined;
  index: number;
  action: number;
  onSelect: () => void;
  selectedUserIndex?: number;
  onExpandUser?: (val: number) => void;
  reasons?: IReason[] | undefined;
  selectedReason?: number;
  onReasonSelect?: (index: number) => void;
  remarks?: string;
  onRemarksChange?: (v: string) => void;
  checkoutReasonFile?: IFile | undefined;
  onCheckoutReasonFileChange?: (v: IFile) => void;
  onError?: (err: string) => void;
}

function UserAccordion(props: IProps): ReactElement {
  const {
    user,
    index,
    action,
    onSelect,
    selectedUserIndex,
    onExpandUser,
    reasons,
    selectedReason,
    onReasonSelect,
    remarks,
    onRemarksChange,
    checkoutReasonFile,
    onCheckoutReasonFileChange,
    onError,
  } = props;

  const [upLoading, setUpLoading] = useState<boolean>(false); // uploading spinner control

  const resetStateIfAny = (): void => {
    if (upLoading) {
      setUpLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement> | undefined,
  ): Promise<void> => {
    try {
      if (event?.target?.files) {
        const file = event.target.files[0];
        try {
          const base64: string = await fileToBase64(file);
          setUpLoading(true);
          window.electron.ipcRenderer.sendMessage('upload-file', {
            base64,
            name: user?.name?.replace(/ /g, '') || '',
            folder: action === 0 ? 'checkin' : 'checkout',
            filetype: file.type.split('image/')[1],
          });
          // on success;
          window.electron.ipcRenderer.on('upload-file-done', (args) => {
            if (args) {
              if (onCheckoutReasonFileChange) {
                onCheckoutReasonFileChange({
                  file,
                  url: base64,
                });
              }
            }
            return setUpLoading(false);
          });
          // on failed
          window.electron.ipcRenderer.on('upload-file-failed', (args) => {
            if (onError) {
              onError(`Error occurred while saving Image: ${args}`);
            }
            return setUpLoading(false);
          });
        } catch (e: any) {
          console.log(e);
          if (onError) {
            onError(`Error occurred: ${e}`);
          }
        }
      }
    } catch (e: any) {
      console.log(e);
      if (upLoading) {
        setUpLoading(false);
      }
      if (onError) {
        onError(`Error occurred: ${e}`);
      }
    }
  };

  const renderUploadedFile = (): ReactElement | null => {
    const val: string | undefined = checkoutReasonFile?.url;
    if (!val) {
      return null;
    }
    return <img src={val} alt="uploaded-file" width={80} height={80} />;
  };

  const renderImageUpload = () => {
    // @ts-ignore
    return (
      <Grid2
        container
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {checkoutReasonFile?.file ? renderUploadedFile() : null}
        <Grid2 mt={5} sm={12} md={12} justifyContent="center" display="flex">
          <Button
            disabled={selectedUserIndex === index ? upLoading : false}
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={
              selectedUserIndex === index ? (
                upLoading ? (
                  <HourglassBottom />
                ) : (
                  <CloudUploadIcon />
                )
              ) : (
                <CloudUploadIcon />
              )
            }
            endIcon={
              selectedUserIndex === index && upLoading ? (
                <CircularProgress color="inherit" size={20} sx={{ mr: 2 }} />
              ) : null
            }
          >
            {selectedUserIndex === index
              ? upLoading
                ? 'Uploading ...'
                : 'Upload Photo'
              : 'Upload Photo'}
            {/* eslint-disable-next-line no-use-before-define */}
            <input
              type="file"
              // @ts-ignore
              /* eslint-disable-next-line no-use-before-define */
              // @ts-ignore
              style={{
                clip: 'rect(0 0 0 0)',
                clipPath: 'inset(50%)',
                height: 1,
                overflow: 'hidden',
                position: 'absolute',
                bottom: 0,
                left: 0,
                whiteSpace: 'nowrap',
                width: 1,
              }}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/jpg"
            />
          </Button>
        </Grid2>
      </Grid2>
    );
  };

  const renderUserDetails = (): ReactElement => {
    return (
      <>
        <Grid2 container p={0.3}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Code:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="body2" fontWeight="bold">
              {user?.code || ''}
            </Typography>
          </Grid2>
        </Grid2>
        <Grid2 container p={0.3}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Last Activity:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="body2" fontWeight="bold">
              {user?.lastAction === 0 ? 'Check IN' : 'Check Out'}
            </Typography>
          </Grid2>
        </Grid2>
        <Grid2 container p={0.3}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Last Activity Time:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="body2" fontWeight="bold">
              {user?.lastActionTime || ''}
            </Typography>
          </Grid2>
        </Grid2>
        {reasons !== undefined ? (
          <Grid2 container p={0.3} pt={5} spacing={2}>
            <Grid2 sm={12} md={6}>
              <TextField
                fullWidth
                id="outlined-remark"
                label="Remarks"
                value={remarks}
                onChange={(
                  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                ) => {
                  resetStateIfAny();
                  if (onRemarksChange) {
                    onRemarksChange(e.target.value);
                  }
                }}
              />
            </Grid2>
            <Grid2 sm={12} md={6}>
              <TextField
                id="outlined-select-reason-native"
                select
                fullWidth
                label="Checkout Reason"
                SelectProps={{
                  native: true,
                }}
                value={selectedReason}
                helperText="Please select a reason for early checkout"
                onChange={(
                  event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                ) => {
                  resetStateIfAny();
                  if (onReasonSelect) {
                    onReasonSelect(Number(event.target.value));
                  }
                }}
              >
                <option value="-1">None</option>
                {reasons.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </TextField>
            </Grid2>
          </Grid2>
        ) : null}
        {selectedReason !== -1 ? renderImageUpload() : null}
      </>
    );
  };

  return (
    <Grid2 sm={5} md={5} key={String(index)}>
      <Accordion
        expanded={selectedUserIndex === index}
        onChange={() => {
          resetStateIfAny();
          if (onExpandUser) {
            onExpandUser(index);
          }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="user-panel1-content"
          id="user-panel1-header"
          sx={{
            backgroundColor: '#fff',
            border: '1px solid rgba(0, 0, 0, .125)',
          }}
        >
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="account"
          >
            <PersonSharpIcon />
          </IconButton>
          <Typography variant="h6" ml={2} mt={0.1}>
            {user?.name || ''}
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            borderTop: '1px solid rgba(0, 0, 0, .125)',
            backgroundColor: '#f8f8f8',
          }}
        >
          {renderUserDetails()}
        </AccordionDetails>
        <AccordionActions>
          <Button variant="contained" color="success" onClick={onSelect}>
            {action === 0 ? 'Check In' : 'Check out'}
          </Button>
        </AccordionActions>
      </Accordion>
    </Grid2>
  );
}

export default UserAccordion;
