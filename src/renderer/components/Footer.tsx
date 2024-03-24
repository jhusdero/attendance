import React from 'react';
import { Box, Toolbar, Typography } from '@mui/material';

type TLink = {
  id: number;
  name: string;
  url: string;
};
const LINKS: TLink[] = [
  {
    id: 1,
    name: 'Onboarding',
    url: 'http://www.creativecentury.com.my/',
  },
  {
    id: 2,
    name: 'Chat',
    url: 'http://www.creativecentury.com.my/',
  },
  {
    id: 3,
    name: 'Kobo Bakery',
    url: 'https://www.kobotogether.com/products',
  },
];

function Footer() {
  return (
    <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
      <Toolbar>
        <Box
          justifyContent="center"
          alignItems="center"
          sx={{
            flexGrow: 1,
            display: { xs: 'none', md: 'flex' },
          }}
        >
          {LINKS.map((i) => {
            return (
              <Typography
                key={i?.id}
                variant="body1"
                color="#000"
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                    textDecorationLine: 'underline',
                  },
                  mx: 5,
                  fontWeight: 500,
                }}
                onClick={() => window.open(i.url || '', 'modal')}
              >
                {i.name || ''}
              </Typography>
            );
          })}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <Typography>v 0.0.1</Typography>
        </Box>
      </Toolbar>
    </Box>
  );
}

export default Footer;
