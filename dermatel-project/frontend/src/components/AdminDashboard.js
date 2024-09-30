import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText,
    Container, Grid, Paper, Box, Avatar, Menu, MenuItem, ThemeProvider, createTheme, CssBaseline,
    TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog,
    DialogActions, DialogContent, DialogTitle, Select, FormControl, InputLabel
} from '@mui/material';
import {
    Menu as MenuIcon, ExitToApp as LogoutIcon, AccountCircle as ProfileIcon, People as PeopleIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });
    const [editUser, setEditUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/super-admin/users`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleCreateUser = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/super-admin/users`, newUser, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            setUsers([...users, response.data]);
            setNewUser({ username: '', password: '', role: '' });
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleUpdateUser = async (id) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/super-admin/users/${id}`, editUser, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            setUsers(users.map(user => (user.id === id ? response.data : user)));
            setEditUser(null);
            setOpenDialog(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/super-admin/users/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
            });
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleEditUser = (user) => {
        setEditUser(user);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setEditUser(null);
        setOpenDialog(false);
    };

    const menuItems = [
        { text: 'Logout', icon: <LogoutIcon />, action: handleLogout }
    ];

    const drawer = (
        <div>
            <Toolbar />
            <List>
                {menuItems.map((item, index) => (
                    <ListItem button key={item.text} onClick={item.action}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={toggleDrawer(true)}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Admin Dashboard
                        </Typography>
                        <IconButton color="inherit" onClick={handleMenuOpen}>
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>AD</Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{ mr: 1 }} /> Logout
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="temporary"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
                        display: { xs: 'none', sm: 'block' },
                    }}
                >
                    {drawer}
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2 }}>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Username</TableCell>
                                                    <TableCell>Role</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {users.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell>{user.username}</TableCell>
                                                        <TableCell>{user.role}</TableCell>
                                                        <TableCell>
                                                            <Button onClick={() => handleEditUser(user)}>Edit</Button>
                                                            <Button onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2 }}>
                                    <TextField
                                        label="Username"
                                        value={newUser.username}
                                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Password"
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        fullWidth
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        >
                                            <MenuItem value="ROLE_USER">User</MenuItem>
                                            <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                                            <MenuItem value="ROLE_DERMATOLOGIST">Dermatologist</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <Button onClick={handleCreateUser}>Create User</Button>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Username"
                        value={editUser?.username || ''}
                        onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={editUser?.password || ''}
                        onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={editUser?.role || ''}
                            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                        >
                            <MenuItem value="ROLE_USER">User</MenuItem>
                            <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                            <MenuItem value="ROLE_DERMATOLOGIST">Dermatologist</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={() => handleUpdateUser(editUser.id)}>Save</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

export default AdminDashboard;