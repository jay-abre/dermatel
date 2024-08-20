import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, IconButton,
    Drawer, List, ListItem, ListItemIcon, ListItemText,
    Container, Grid, Paper, Tabs, Tab, Box, Avatar,
    ThemeProvider, createTheme, CssBaseline
} from '@mui/material';
import {
    Menu as MenuIcon,
    Event as EventIcon,
    VideoCall as VideoCallIcon,
    Message as MessageIcon,
    Description as DescriptionIcon,
    AttachMoney as AttachMoneyIcon,
    People as PeopleIcon,
    Camera as SkinCareIcon, // Add this for Eczema feature
    ExitToApp as LogoutIcon
} from '@mui/icons-material';

// Create a custom theme
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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        { text: 'Appointments', icon: <EventIcon />, path: '/appointments' },
        { text: 'Video Calls', icon: <VideoCallIcon />, path: '/video-calls' },
        { text: 'Messaging', icon: <MessageIcon />, path: '/messaging' },
        { text: 'EHR', icon: <DescriptionIcon />, path: '/ehr' },
        { text: 'Billing', icon: <AttachMoneyIcon />, path: '/billing' },
        { text: 'Patients', icon: <PeopleIcon />, path: '/patients' },
        { text: 'Eczema', icon: <SkinCareIcon />, path: '/eczema' } // Add this for Eczema feature
    ];

    const drawer = (
        <div>
            <Toolbar />
            <List>
                {menuItems.map((item, index) => (
                    <ListItem button key={item.text} component={Link} to={item.path}>
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
                            Telemedicine Dashboard
                        </Typography>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>JD</Avatar>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="temporary"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
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
                                        {menuItems.map((item) => (
                                            <Tab key={item.text} label={item.text} icon={item.icon} />
                                        ))}
                                    </Tabs>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    {/* Add content for each tab here */}
                                    <Typography variant="h5">
                                        {value === 0 && "Appointments Content"}
                                        {value === 1 && "Video Calls Content"}
                                        {value === 2 && "Messaging Content"}
                                        {value === 3 && "EHR Content"}
                                        {value === 4 && "Billing Content"}
                                        {value === 5 && "Patients Content"}
                                        {value === 6 && "Eczema Feature Content"} {/* Display Eczema content */}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}


