import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, IconButton,
    Drawer, List, ListItem, ListItemIcon, ListItemText,
    Container, Grid, Paper, Tabs, Tab, Box, Avatar, Menu, MenuItem,
    ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import {
    Menu as MenuIcon,
    ExitToApp as LogoutIcon,
    AccountCircle as ProfileIcon,
    Event as EventIcon,
    VideoCall as VideoCallIcon,
    Message as MessageIcon,
    Description as DescriptionIcon,
    AttachMoney as AttachMoneyIcon,
    Image as ImageIcon // Import ImageIcon
} from '@mui/icons-material';
import KycProfile from './KYCForm';
import Appointments from './Appointment';
import VideoConference from './VideoConference';
import ScanEczema from './ScanEczema';
import Billing from "./Billing";
import EHR from "./EHR";
import Chat from "./Chat";

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

export default function Dashboard() {
    const [value, setValue] = useState(0);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
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

    const handleProfile = () => {
        navigate('/dashboard/profile');
    };

    const menuItems = [
        { text: 'Profile', icon: <ProfileIcon />, action: handleProfile },
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

    const mainTabs = [
        { text: 'Appointments', icon: <EventIcon />, path: 'appointments' },
        { text: 'Video Calls', icon: <VideoCallIcon />, path: 'videocalls' },
        { text: 'Messaging', icon: <MessageIcon />, path: 'messaging' },
        { text: 'EHR', icon: <DescriptionIcon />, path: 'ehr' },
        { text: 'Billing', icon: <AttachMoneyIcon />, path: 'billing' },
        { text: 'Scan Eczema', icon: <ImageIcon />, path: 'scan-eczema' } // Add Scan Eczema tab
    ];

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
                            DERMATEL
                        </Typography>
                        <IconButton color="inherit" onClick={handleMenuOpen}>
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>JD</Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleProfile}>
                                <ProfileIcon sx={{ mr: 1 }} /> Profile
                            </MenuItem>
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
                                    <Tabs value={value} onChange={handleChange} centered>
                                        {mainTabs.map((item, index) => (
                                            <Tab key={index} label={item.text} icon={item.icon} component={Link} to={item.path} />
                                        ))}
                                    </Tabs>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Routes>
                                        <Route path="profile" element={<KycProfile />} />
                                        <Route path="appointments" element={<Appointments />} />
                                        <Route path="videocalls" element={<VideoConference />} />
                                        <Route path="messaging" element={<Chat />} />
                                        <Route path="ehr" element={<EHR />} />
                                        <Route path="billing" element={<Billing />} />
                                        <Route path="scan-eczema" element={<ScanEczema />} /> {/* Add ScanEczema route */}
                                    </Routes>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}