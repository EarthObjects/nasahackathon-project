import * as React from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Typography from '@mui/material/Typography';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../ThemeContext';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: alpha(theme.palette.background.default, 0.4),
    boxShadow: theme.shadows[1],
    padding: '8px 12px',
}));

export default function AppAppBar({ onToggleList }) {
    const [open, setOpen] = React.useState(false);
    const { mode, toggleTheme } = useThemeContext();
    const theme = useTheme();

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <AppBar position="fixed" sx={{ boxShadow: 0, bgcolor: 'transparent', backgroundImage: 'none', mt: 2 }}>
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Box component="img" src="icon.svg" alt="SpaceObjects Icon" sx={{ width: 30, height: 30, mr: 1 }} />
                        <Typography variant="h6" component="div" sx={{ color: theme.palette.text.primary }}>
                            SpaceObjects.co
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', px: 0 , gap: 1}}>
                        <Button color="primary" variant="text" size="small" onClick={() => onToggleList('all')}>
                            All
                        </Button>
                        <Button color="primary" variant="text" size="small" onClick={() => onToggleList('objects')}>
                            Objects
                        </Button>
                        <Button color="primary" variant="text" size="small" onClick={() => onToggleList('asteroids')}>
                            Asteroids
                        </Button>
                        <Button color="primary" variant="text" size="small" onClick={() => onToggleList('comets')}>
                            Comets
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <Button color="primary" variant="text" size="small" onClick={() => onToggleList('toggleMap')}>
                            Focus map
                        </Button>
                        <IconButton color="primary" onClick={toggleTheme}>
                            {mode === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
                            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>
                                <Divider sx={{ my: 3 }} />
                                <MenuItem onClick={() => onToggleList('all')}>All</MenuItem>
                                <MenuItem onClick={() => onToggleList('objects')}>Objects</MenuItem>
                                <MenuItem onClick={() => onToggleList('asteroids')}>Asteroids</MenuItem>
                                <MenuItem onClick={() => onToggleList('comets')}>Comets</MenuItem>
                                <MenuItem color={"primary"} onClick={() => onToggleList('toggleMap')}>Focus map</MenuItem>
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}