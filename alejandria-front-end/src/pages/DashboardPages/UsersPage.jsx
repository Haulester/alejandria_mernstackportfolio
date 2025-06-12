import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { fetchUsers, createUser, updateUser, deleteUser } from "../../services/UserService";

const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor', 
  VIEWER: 'viewer'
};

const UsersPage = () => {
  // Get current user role from localStorage or state
  const currentUserRole = localStorage.getItem('userType') || ROLES.VIEWER;
  
  // Check if current user has access to this page
  const hasPageAccess = currentUserRole !== ROLES.EDITOR;
  
  // State management
  const [users, setUsers] = useState([]);
  const [frequentUsers, setFrequentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [userType, setUserType] = useState('daily'); // 'daily' or 'frequent'
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    contactNumber: '',
    email: '',
    username: '',
    password: '',
    address: '',
    type: ROLES.VIEWER
  });

  // Define columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'firstName', headerName: 'First Name', width: 130, editable: currentUserRole === ROLES.ADMIN },
    { field: 'lastName', headerName: 'Last Name', width: 130, editable: currentUserRole === ROLES.ADMIN },
    { field: 'email', headerName: 'Email', width: 200, editable: currentUserRole === ROLES.ADMIN },
    { field: 'username', headerName: 'Username', width: 130, editable: currentUserRole === ROLES.ADMIN },
    { field: 'age', headerName: 'Age', type: 'number', width: 80, editable: currentUserRole === ROLES.ADMIN },
    { field: 'gender', headerName: 'Gender', width: 100, editable: currentUserRole === ROLES.ADMIN },
    { field: 'contactNumber', headerName: 'Contact', width: 150, editable: currentUserRole === ROLES.ADMIN },
    { 
      field: 'type', 
      headerName: 'Role', 
      width: 120,
      renderCell: (params) => {
        const roleColor = {
          [ROLES.ADMIN]: 'error',
          [ROLES.EDITOR]: 'warning', 
          [ROLES.VIEWER]: 'info'
        };
        return (
          <Chip 
            label={params.value} 
            color={roleColor[params.value]} 
            size="small" 
            variant="outlined"
          />
        );
      }
    },
    { 
      field: 'isActive', 
      headerName: 'Status', 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Active' : 'Inactive'} 
          color={params.value ? 'success' : 'default'} 
          size="small" 
          variant="outlined"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params, gridType) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {currentUserRole === ROLES.ADMIN && (
            <>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => handleEditUser(params.row, gridType)}
              >
                Edit
              </Button>
              <Button 
                size="small" 
                variant="outlined" 
                color="error"
                onClick={() => handleDeleteUser(params.row.id, gridType)}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      ),
    },
  ];

  // If user doesn't have access, show access denied
  if (!hasPageAccess) {
    return (
      <Box sx={{ padding: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Editors do not have access to the Users page.
        </Typography>
        <Alert severity="error" sx={{ mt: 3, maxWidth: 500, mx: 'auto' }}>
          You need administrator or viewer privileges to access this page.
        </Alert>
      </Box>
    );
  }

  // Load users on component mount
  useEffect(() => {
    loadUsers();
    loadFrequentUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchUsers();
      const formattedUsers = response.data.users.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        age: user.age,
        gender: user.gender,
        contactNumber: user.contactNumber,
        address: user.address,
        type: user.type,
        isActive: user.isActive
      }));
      // Filter users for daily users (you can modify this logic based on your needs)
      setUsers(formattedUsers.slice(0, Math.ceil(formattedUsers.length / 2)));
    } catch (error) {
      console.error('Error loading users:', error);
      showAlertMessage('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadFrequentUsers = async () => {
    try {
      const response = await fetchUsers();
      const formattedUsers = response.data.users.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        age: user.age,
        gender: user.gender,
        contactNumber: user.contactNumber,
        address: user.address,
        type: user.type,
        isActive: user.isActive
      }));
      // Filter users for frequent users (you can modify this logic based on your needs)
      setFrequentUsers(formattedUsers.slice(Math.ceil(formattedUsers.length / 2)));
    } catch (error) {
      console.error('Error loading frequent users:', error);
      showAlertMessage('Failed to load frequent users', 'error');
    }
  };

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      contactNumber: '',
      email: '',
      username: '',
      password: '',
      address: '',
      type: ROLES.VIEWER
    });
    setCurrentUser(null);
    setIsEditing(false);
  };

  const showAlertMessage = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleSaveUser = async () => {
    // Check permissions
    if (currentUserRole === ROLES.VIEWER) {
      showAlertMessage('Viewers do not have permission to modify users', 'error');
      return;
    }

    try {
      setIsLoading(true);
      
      // Validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.username) {
        showAlertMessage('Please fill in all required fields', 'error');
        setIsLoading(false);
        return;
      }

      if (isEditing) {
        await updateUser(currentUser.id, formData);
        showAlertMessage('User updated successfully');
      } else {
        await createUser(formData);
        showAlertMessage('User added successfully');
      }
      
      await loadUsers(); // Refresh both lists
      await loadFrequentUsers();
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
      showAlertMessage(error.response?.data?.message || 'Error saving user', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user, gridType = 'daily') => {
    // Check permissions
    if (currentUserRole === ROLES.VIEWER) {
      showAlertMessage('Viewers do not have permission to edit users', 'error');
      return;
    }

    setCurrentUser(user);
    setUserType(gridType);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      age: user.age ? user.age.toString() : '',
      gender: user.gender || '',
      contactNumber: user.contactNumber || '',
      email: user.email || '',
      username: user.username || '',
      password: '',
      address: user.address || '',
      type: user.type || ROLES.VIEWER
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId, gridType = 'daily') => {
    // Check permissions
    if (currentUserRole !== ROLES.ADMIN) {
      showAlertMessage('Only administrators can delete users', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        showAlertMessage('User deleted successfully');
        await loadUsers(); // Refresh both lists
        await loadFrequentUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        showAlertMessage(error.response?.data?.message || 'Error deleting user', 'error');
      }
    }
  };

  const handleAddUser = () => {
    // Check permissions
    if (currentUserRole === ROLES.VIEWER) {
      showAlertMessage('Viewers do not have permission to add users', 'error');
      return;
    }

    resetForm();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const getRoleDisplayName = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Users Management
        </Typography>
        <Chip 
          label={`Current Role: ${getRoleDisplayName(currentUserRole)}`} 
          color={currentUserRole === ROLES.ADMIN ? 'error' : currentUserRole === ROLES.EDITOR ? 'warning' : 'info'}
          variant="outlined"
        />
      </Box>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        Below is the list of daily users and frequent users.
      </Typography>

      {/* Alert */}
      {showAlert && (
        <Alert 
          severity={alertSeverity} 
          onClose={() => setShowAlert(false)}
          sx={{ mb: 2 }}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Action Buttons */}
      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={handleAddUser}
          sx={{ mr: 2 }}
          disabled={currentUserRole === ROLES.VIEWER}
        >
          Add User
        </Button>
        {currentUserRole === ROLES.VIEWER && (
          <Typography variant="caption" color="text.secondary">
            * Viewers can only view user data
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Daily Users Section */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Daily Users ({users.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          These users have accessed the platform recently.
        </Typography>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns.map(col => {
              if (col.field === 'actions') {
                return {
                  ...col,
                  renderCell: (params) => (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {currentUserRole === ROLES.ADMIN && (
                        <>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => handleEditUser(params.row, 'daily')}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error"
                            onClick={() => handleDeleteUser(params.row.id, 'daily')}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </Box>
                  ),
                };
              }
              return col;
            })}
            pageSize={5}
            checkboxSelection={currentUserRole === ROLES.ADMIN}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell': {
                cursor: currentUserRole === ROLES.VIEWER ? 'default' : 'pointer'
              }
            }}
          />
        </Box>
      </Paper>

      {/* Frequent Users Section */}
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Frequent Users ({frequentUsers.length})
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          These users have accessed the platform multiple times.
        </Typography>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={frequentUsers}
            columns={columns.map(col => {
              if (col.field === 'actions') {
                return {
                  ...col,
                  renderCell: (params) => (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {currentUserRole === ROLES.ADMIN && (
                        <>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            onClick={() => handleEditUser(params.row, 'frequent')}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error"
                            onClick={() => handleDeleteUser(params.row.id, 'frequent')}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </Box>
                  ),
                };
              }
              return col;
            })}
            pageSize={5}
            checkboxSelection={currentUserRole === ROLES.ADMIN}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell': {
                cursor: currentUserRole === ROLES.VIEWER ? 'default' : 'pointer'
              }
            }}
          />
        </Box>
      </Paper>

      {/* User Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name *"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name *"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username *"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age *"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender *</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number *"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role *</InputLabel>
                <Select
                  value={formData.type}
                  label="Role"
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <MenuItem value={ROLES.VIEWER}>Viewer</MenuItem>
                  <MenuItem value={ROLES.EDITOR}>Editor</MenuItem>
                  <MenuItem value={ROLES.ADMIN}>Administrator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address *"
                multiline
                rows={3}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={isEditing ? "New Password (leave blank to keep current)" : "Password *"}
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                variant="outlined"
              />
            </Grid>
            {!isEditing && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>User Type</InputLabel>
                  <Select
                    value={userType}
                    label="User Type"
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <MenuItem value="daily">Daily User</MenuItem>
                    <MenuItem value="frequent">Frequent User</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveUser}
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;