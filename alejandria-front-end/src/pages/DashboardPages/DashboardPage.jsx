import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, Typography, Paper, Divider, TextField, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const DashboardPage = () => {
  const location = useLocation();
  const { name } = location.state || {};

 
  const countryUserData = [
    { id: 0, value: 120, label: 'Philippines' },
    { id: 1, value: 80, label: 'United States' },
    { id: 2, value: 60, label: 'India' },
    { id: 3, value: 40, label: 'Canada' },
    { id: 4, value: 30, label: 'Australia' },
  ];

  
  const barUserData = [
    { month: 'Jan', philippines: 40, usa: 30, india: 20 },
    { month: 'Feb', philippines: 50, usa: 25, india: 30 },
    { month: 'Mar', philippines: 30, usa: 35, india: 25 },
  ];

  const valueFormatter = (value) => `${value} users`;

  
  const [userRows, setUserRows] = useState([
    { id: 1, name: 'Jon Snow', country: 'Philippines', dailyUsers: 20, frequentUsers: 100 },
    { id: 2, name: 'Cersei Lannister', country: 'United States', dailyUsers: 30, frequentUsers: 90 },
    { id: 3, name: 'Jaime Lannister', country: 'India', dailyUsers: 15, frequentUsers: 80 },
    { id: 4, name: 'Arya Stark', country: 'Canada', dailyUsers: 25, frequentUsers: 60 },
    { id: 5, name: 'Daenerys Targaryen', country: 'Australia', dailyUsers: 10, frequentUsers: 50 },
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    country: '',
    dailyUsers: '',
    frequentUsers: '',
  });

  const userColumns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200, editable: true },
    { field: 'country', headerName: 'Country', width: 180, editable: true },
    { field: 'dailyUsers', headerName: 'Daily Users', type: 'number', width: 180, editable: true },
    { field: 'frequentUsers', headerName: 'Frequent Users', type: 'number', width: 180, editable: true },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"  
          onClick={() => handleDeleteUser(params.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleCreateUser = () => {
    const newUserData = {
      id: userRows.length + 1,
      name: newUser.name,
      country: newUser.country,
      dailyUsers: parseInt(newUser.dailyUsers),
      frequentUsers: parseInt(newUser.frequentUsers),
    };
    setUserRows([...userRows, newUserData]);
    setNewUser({ name: '', country: '', dailyUsers: '', frequentUsers: '' }); 
  };

  const handleDeleteUser = (id) => {
    const updatedRows = userRows.filter((user) => user.id !== id);
    setUserRows(updatedRows);
  };

  return (
    <div className="welcome-page-container">
      <div className="welcome-page">
        <h1>Welcome, {name}!</h1>

        <div className="charts-container">
          
          <div className="chart-box">
            <h2>User Distribution by Country</h2>
            <PieChart
              series={[{ data: countryUserData }]}
              width={400}
              height={300}
            />
          </div>

        
          <div className="chart-box">
            <h2>Monthly User Growth</h2>
            <BarChart
              dataset={barUserData}
              xAxis={[{ dataKey: 'month' }]}
              series={[
                { dataKey: 'philippines', label: 'Philippines', valueFormatter },
                { dataKey: 'usa', label: 'United States', valueFormatter },
                { dataKey: 'india', label: 'India', valueFormatter },
              ]}
              height={300}
            />
          </div>

          
          <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
            <Typography variant="h6" gutterBottom>
              Users Overview
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={userRows}
                columns={userColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                onRowEditCommit={(params) => {
                  const updatedRows = userRows.map((row) => {
                    if (row.id === params.id) {
                      return { ...row, ...params.values };
                    }
                    return row;
                  });
                  setUserRows(updatedRows);
                }}
              />
            </Box>
          </Paper>

        
          <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add New User
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Name"
                variant="outlined"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <TextField
                label="Country"
                variant="outlined"
                value={newUser.country}
                onChange={(e) => setNewUser({ ...newUser, country: e.target.value })}
              />
              <TextField
                label="Daily Users"
                variant="outlined"
                type="number"
                value={newUser.dailyUsers}
                onChange={(e) => setNewUser({ ...newUser, dailyUsers: e.target.value })}
              />
              <TextField
                label="Frequent Users"
                variant="outlined"
                type="number"
                value={newUser.frequentUsers}
                onChange={(e) => setNewUser({ ...newUser, frequentUsers: e.target.value })}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateUser}
                sx={{ width: '150px', alignSelf: 'center' }}
              >
                Add User
              </Button>
            </Box>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
