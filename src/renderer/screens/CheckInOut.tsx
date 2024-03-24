import React, { ReactElement, useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Alert, Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { ICheckInOutProps, IError, IFile, IUser } from '../types';
import WebCamComponent from '../components/WebCamComponent';
import Confirmation from '../components/Confirmation';
import UserAccordion from '../components/UserAccordion';

function CheckInOut(props: ICheckInOutProps): ReactElement {
  const { action } = props;
  const { state } = useLocation();
  const { users, reasons } = state;
  const [selectedUser, setSelectedUser] = useState<IUser | undefined>(
    undefined,
  );
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(-1);
  const [activateWebCam, setActivateWebCam] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [selectedReason, setSelectedReason] = useState<number>(-1);
  const [remarks, setRemarks] = useState<string>('');
  const [checkoutReasonFile, setCheckoutReasonFile] = useState<
    IFile | undefined
  >(undefined);
  const [error, setError] = useState<IError>({ error: false, message: '' });

  const resetAccordionUserState = (): void => {
    if (selectedReason !== -1) {
      setSelectedReason(-1);
    }
    if (remarks !== '') {
      setRemarks('');
    }
    if (error.error) {
      setError({ error: false, message: '' });
    }
    setCheckoutReasonFile(undefined);
  };

  if (activateWebCam) {
    return (
      <WebCamComponent
        onCapture={(img) => {
          setImage(img);
          setActivateWebCam(false);
        }}
        user={selectedUser}
      />
    );
  }

  if (image) {
    return (
      <Confirmation
        image={image}
        userInfo={selectedUser}
        action={action}
        remarks={remarks}
      />
    );
  }

  return (
    <Box sx={{ overflow: 'hidden', overflowY: 'scroll', p: 5 }}>
      <Grid2 container justifyContent="center" alignItems="center">
        <Grid2>
          <Typography variant="body1">
            Choose an employee from the list below
          </Typography>
        </Grid2>
      </Grid2>
      {error.error ? (
        <Grid2
          container
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid2 md={6} sm={12}>
            <Alert
              severity="error"
              onClose={() => setError({ error: false, message: '' })}
            >
              {error.message}
            </Alert>
          </Grid2>
        </Grid2>
      ) : null}
      <Grid2
        my={4}
        container
        display="flex"
        justifyContent="center"
        spacing={3}
      >
        {users?.map((i: IUser, v: number) => {
          return (
            <UserAccordion
              key={i?.code}
              user={i}
              index={v}
              action={action}
              selectedUserIndex={selectedUserIndex}
              onExpandUser={(val: number) => {
                setSelectedUserIndex(val);
                if (val !== selectedUserIndex) {
                  resetAccordionUserState();
                }
              }}
              onSelect={() => {
                setSelectedUser(users[v]);
                return setActivateWebCam(true);
              }}
              reasons={action === 1 ? reasons : undefined}
              selectedReason={selectedReason}
              onReasonSelect={(val) => setSelectedReason(val)}
              remarks={remarks}
              onRemarksChange={(val) => setRemarks(val)}
              checkoutReasonFile={checkoutReasonFile}
              onCheckoutReasonFileChange={(val) => {
                setCheckoutReasonFile(val);
              }}
              onError={(err: string) => {
                setError({ error: true, message: err });
              }}
            />
          );
        }) || null}
      </Grid2>
    </Box>
  );
}

export default CheckInOut;
