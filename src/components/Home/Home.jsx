import React from 'react';
import { Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#00C4CC',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '2rem'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '600px',
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <img
          src="/images/laundry.png" // Update with the correct path to the image
          alt="Laundry"
          style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
        />
        <Typography variant="h4" component="h1" gutterBottom>
          EXPERIENCE THE ULTIMATE CONVENIENCE WITH RUSH LAUNDRY - COMING SOON!
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
