import React, { ReactElement, useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Box, Typography } from '@mui/material';
import { ICheckInOutProps, IUser } from '../types';
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

function CheckInOut(props: ICheckInOutProps): ReactElement {
  const { action } = props;
  const [users, setUsers] = useState<IUser[] | undefined>(EMPLOYEES);
  const [selectedUser, setSelectedUser] = useState<IUser | undefined>(
    undefined,
  );
  const [activateWebCam, setActivateWebCam] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(undefined);

  if (activateWebCam) {
    return (
      <WebCamComponent
        onCapture={(img) => {
          console.log(img);
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
          <Typography variant="h6">
            Choose an employee from the list below
          </Typography>
        </Grid2>
      </Grid2>
      <Grid2
        my={10}
        container
        display="flex"
        justifyContent="center"
        spacing={3}
        alignItems="center"
      >
        {users?.map((i, v) => {
          return (
            <UserAccordion
              key={v}
              user={i}
              index={v}
              action={action}
              onSelect={() => {
                setSelectedUser(EMPLOYEES[v]);
                return setActivateWebCam(true);
              }}
            />
          );
        }) || null}
      </Grid2>
    </Box>
  );
}

export default CheckInOut;
