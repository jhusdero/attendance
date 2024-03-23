import React, { ReactElement, useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Alert, Box, Typography } from '@mui/material';
import { ICheckInOutProps, IError, IFile, IReason, IUser } from '../types';
import WebCamComponent from '../components/WebCamComponent';
import SuccessComponent from '../components/SuccessComponent';
import UserAccordion from '../components/UserAccordion';

const EMPLOYEES: IUser[] = [
  {
    name: 'Derrick Mugenyi',
    code: 'E001',
    department: 'RnD',
    lastAction: 0,
    lastActionTime: '2024-03-10 10:00',
  },
  {
    name: 'Trevor Suna',
    code: 'E002',
    department: 'RnD',
    lastAction: 0,
    lastActionTime: '2024-03-10 10:00',
  },
];

const CHECKOUT_REASONS: IReason[] = [
  {
    value: 1,
    label: 'Sulat',
  },
  {
    value: 2,
    label: 'Lunch',
  },
  {
    value: 3,
    label: 'Meeting',
  },
];

function CheckInOut(props: ICheckInOutProps): ReactElement {
  const { action } = props;
  const [users, setUsers] = useState<IUser[] | undefined>(EMPLOYEES);
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
      <SuccessComponent image={image} userInfo={selectedUser} action={action} />
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
        {users?.map((i, v) => {
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
                setSelectedUser(EMPLOYEES[v]);
                return setActivateWebCam(true);
              }}
              reasons={action === 1 ? CHECKOUT_REASONS : undefined}
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
