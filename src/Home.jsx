import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Animate } from 'react-simple-animate';
import ListSection from "./components/ListSection.jsx";
import Detail from "./components/Detail.jsx";
import {useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CanvasComponent } from './components/Canvas.jsx';

function Home({ isListVisible, currentList }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const theme = useTheme();

    const objects = [
        { primary: 'Object 1', secondary: '203,201 km from Earth', icon: 'image' },
        { primary: 'Object 2', secondary: '2,032,051 km from Earth', icon: 'image' },
        { primary: 'Object 3', secondary: '2,032,214,351 km from Earth', icon: 'image' },
        { primary: 'Object 4', secondary: '2,032,214,351 km from Earth', icon: 'image'},
        { primary: 'Object 5', secondary: '2,032,214,351 km from Earth', icon: 'image'}
    ];

    const asteroids = [
        { primary: 'Asteroid 1', secondary: '203,201 km from Earth', icon: 'work' },
        { primary: 'Asteroid 2', secondary: '2,032,051 km from Earth', icon: 'work' },
        { primary: 'Asteroid 3', secondary: '2,032,214,351 km from Earth', icon: 'work' },
        { primary: 'Asteroid 4', secondary: '2,032,214,351 km from Earth', icon: 'work' },
        { primary: 'Asteroid 5', secondary: '2,032,214,351 km from Earth', icon: 'work' }
    ];

    const comets = [
        { primary: 'Comet 1', secondary: '203,201 km from Earth', icon: 'beach' },
        { primary: 'Comet 2', secondary: '2,032,051 km from Earth', icon: 'beach' },
        { primary: 'Comet 3', secondary: '2,032,214,351 km from Earth', icon: 'beach' },
        { primary: 'Comet 4', secondary: '2,032,214,351 km from Earth', icon: 'beach' },
        { primary: 'Comet 5', secondary: '2,032,214,351 km from Earth', icon: 'beach'}
    ];

    const potentialHazardous = [
        { primary: 'Object 1', secondary: '203,201 km from Earth', icon: 'warning' },
        { primary: 'Asteroid 1', secondary: '203,201 km from Earth', icon: 'warning' },
        { primary: 'Comet 1', secondary: '203,201 km from Earth', icon: 'warning' }
    ];

    const getListItems = () => {
        switch (currentList) {
            case 'objects':
                return objects;
            case 'asteroids':
                return asteroids;
            case 'comets':
                return comets;
            case 'potential_Hazardous':
                return potentialHazardous;
            case 'all':
                return [...objects, ...asteroids, ...comets, ...potentialHazardous];
            default:
                return [];
        }
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const handleBack = () => {
        setSelectedItem(null);
    };

    return (
        <Container style={{backgroundColor: theme.palette.background.default}}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={isListVisible ? 4 : 4}>
                    <Animate
                        play={isListVisible}
                        start={{ opacity: 0, transform: 'translateX(-100%)' }}
                        end={{ opacity: 1, transform: 'translateX(0)' }}
                        duration={0.3}
                    >
                        {isListVisible && !selectedItem && (
                            <div>
                                <ListSection title={currentList} items={getListItems()} onViewMore={() => {}} onItemClick={handleItemClick} />
                            </div>
                        )}
                        {selectedItem && (
                            <Detail item={selectedItem} onBack={handleBack} />
                        )}
                    </Animate>
                </Grid>
                <Grid item xs={12} md={isListVisible ? 8 : 8}>
                    <Animate
                        play={isListVisible}
                        start={{ transform: 'translateX(-30%) scale(1.5)' }}
                        end={{ transform: 'translateX(0)' }}
                        duration={0.3}
                    >
                        <CanvasComponent />
                    </Animate>
                </Grid>
            </Grid>
            <Box component="section" sx={{p: 8, backgroundColor: theme.palette.background.default}}>
            </Box>
            <Box component="section" sx={{p: 5, backgroundColor: theme.palette.background.default}}>
                <Typography sx={{ color: theme.palette.text.disabled }}>
                    Made with ❤ by the Runtime Terror team
                </Typography>
            </Box>
        </Container>
    );
}

export default Home;