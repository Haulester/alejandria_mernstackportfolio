import React from 'react';
import { Box, Stack, Typography, Paper, Divider } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

const ReportsPage = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reports & Visualizations
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Analyze user distribution and growth trends from different countries.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Stack spacing={4}>
   
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" gutterBottom>
            User Growth Trends by Country
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            These charts show the change in user counts from select countries over time.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <SparkLineChart
                data={[40, 50, 30]} 
                height={100}
                area
              />
              <Typography variant="caption" display="block" textAlign="center" mt={1}>
                Philippines
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <SparkLineChart
                data={[30, 25, 35]} 
                height={100}
                curve="natural"
                area
              />
              <Typography variant="caption" display="block" textAlign="center" mt={1}>
                United States
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <SparkLineChart
                data={[20, 30, 25]} 
                height={100}
                curve="natural"
                area
              />
              <Typography variant="caption" display="block" textAlign="center" mt={1}>
                India
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ReportsPage;
