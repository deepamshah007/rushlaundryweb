import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box className="footer">
      <Typography variant="h6" sx={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '2.5rem' }}>
        Rush Technologies Ltd
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <Link href="#" color="inherit">
          <i className="fab fa-instagram"></i>
        </Link>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <Link href="#" color="inherit">
          ABOUT
        </Link>
        <Link href="#" color="inherit">
          CONTACT US
        </Link>
        <Link href="#" color="inherit">
          PRIVACY POLICY
        </Link>
        <Link href="#" color="inherit">
          CAREERS
        </Link>
      </Box>
      <Typography variant="body2">
        Copyright © 2024 Rush Technologies Ltd - All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
