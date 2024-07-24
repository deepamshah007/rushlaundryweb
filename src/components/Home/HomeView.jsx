import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';

const HomeView = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#ffffff', // White background color for the entire page
        padding: '2rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          backgroundColor: '#00C4CC', // Sky blue background for the top section
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem',
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/rushlaundry-1.png`} // Update with the correct path to your logo
          alt="Company Logo"
          style={{ height: '350px', width: 'auto', marginRight: '4rem' }} // Adjust the size and margin as needed
        />
        <Typography
          variant="h4"
          component="h1"
          sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}
        >
          EXPERIENCE THE ULTIMATE CONVENIENCE WITH RUSH LAUNDRY - COMING SOON!
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#00C4CC',
            color: 'white',
            '&:hover': {
              backgroundColor: '#00B2B8',
            },
          }}
        >
          Subscribe Now
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ marginTop: '2rem' }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              alt="For Homeowners"
              height="140"
              src={`${process.env.PUBLIC_URL}/home.png`} // Update with the correct path to the image
            />
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                For Homeowners
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tired of spending hours doing laundry? Say goodbye to the hassle and hello to more time with your family! Our online laundry service is here to save you time and effort. With a simple click, your laundry will be delivered right to your doorstep, cutting down your personal energy costs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              alt="For Working Professionals"
              height="140"
              src={`${process.env.PUBLIC_URL}/work.png`} // Update with the correct path to the image
            />
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                For Working Professionals
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Work, family, and laundry - the trifecta of life's daily struggles. But with our online laundry service, you can relax and let us handle the work. Our fast and convenient service will save you time and effort, and the best part? Your freshly cleaned clothes will be delivered straight to your doorstep!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              alt="For Students"
              height="140"
              src={`${process.env.PUBLIC_URL}/students.png`} // Update with the correct path to the image
            />
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                For Students
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Balancing University and laundry can be a challenge. Let us take the burden off your shoulders. Our online laundry service will save you time and effort so you can focus on your studies. Get your clean clothes delivered right to your doorstep and never miss a deadline again!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeView;
