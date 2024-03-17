import React, { ReactElement } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import { IUser } from '../types';

interface IProps {
  user: IUser | undefined;
  index: number;
  action: number;
  onSelect: () => void;
}

function UserAccordion(props: IProps): ReactElement {
  const { user, index, action, onSelect } = props;
  const renderUserDetails = (): ReactElement => {
    return (
      <>
        <Grid2 container p={0.3}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Code:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="h7">{user?.code || ''}</Typography>
          </Grid2>
        </Grid2>
        <Grid2 container p={0.3}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Last Activity:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="h7">
              {user?.lastAction === 0 ? 'Check IN' : 'Check Out'}
            </Typography>
          </Grid2>
        </Grid2>
        <Grid2 container p={0.3}>
          <Grid2 sm={5} md={5}>
            <Typography variant="body2">Last Activity Time:</Typography>
          </Grid2>
          <Grid2 sm={7} md={7}>
            <Typography variant="h7">{user?.lastActionTime || ''}</Typography>
          </Grid2>
        </Grid2>
      </>
    );
  };

  return (
    <Grid2 sm={5} md={5} key={String(index)}>
      <Accordion defaultExpanded>
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
