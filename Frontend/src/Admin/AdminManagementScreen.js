import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import Navbar from '../Components/Navbar';

const AdminManagementScreen = () => {
  const handleNavigation = (url) => {
    window.location.href = url;
  };

  const options = [
    { icon: '👤', label: 'Manage Users', url: '/admin/manage-user', bgColor: '#E3F2FD' },
    { icon: '🤝', label: 'Manage Partners', url: '/admin/manage-partner', bgColor: '#FCE4EC' },
    { icon: '🏞️', label: 'Manage Attractions', url: '/admin/manage-attraction', bgColor: '#E8F5E9' },
    { icon: '📝', label: 'Manage Reviews', url: '/admin/manage-review', bgColor: '#FFF3E0' },
  ];

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />

      <Box flex={1} p={4} bgcolor="#f9f9f9" display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h3" fontWeight="bold" mb={4}>
          Admin Dashboard
        </Typography>

        <Grid container spacing={4} justifyContent="center" maxWidth="800px">
          {options.map((option, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper
                onClick={() => handleNavigation(option.url)}
                elevation={4}
                sx={{
                  padding: 4,
                  height: 180,
                  backgroundColor: option.bgColor,
                  borderRadius: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography variant="h3" mb={2}>
                  {option.icon}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {option.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box bgcolor="#00002a" color="white" textAlign="center" py={2} fontSize="14px">
        &copy; 2025 SingScape. Created by Group FDAC - SC2006.
      </Box>
    </Box>
  );
};

export default AdminManagementScreen;
