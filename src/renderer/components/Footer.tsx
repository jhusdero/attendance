import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';

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
      <Card>
        <CardContent>
          <Grid2
            container
            elevation={2}
            spacing={10}
            justifyContent="center"
            alignItems="center"
          >
            {LINKS.map((i) => {
              return (
                <Grid2 key={i.id}>
                  <Typography
                    variant="body1"
                    color="#000"
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                        textDecorationLine: 'underline',
                      },
                      fontWeight: 500,
                    }}
                    onClick={() => window.open(i.url || '', 'modal')}
                  >
                    {i.name || ''}
                  </Typography>
                </Grid2>
              );
            })}
          </Grid2>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Footer;
