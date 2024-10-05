import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Animate } from 'react-simple-animate';
import ListSection from "./components/ListSection.jsx";
import Detail from "./components/Detail.jsx";

function Home({ isListVisible, currentList }) {
    const [selectedItem, setSelectedItem] = useState(null);

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

    const getListItems = () => {
        switch (currentList) {
            case 'objects':
                return objects;
            case 'asteroids':
                return asteroids;
            case 'comets':
                return comets;
            case 'all':
                return [...objects, ...asteroids, ...comets];
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
        <Container>
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
                        start={{ transform: 'translateX(-25%) scale(1.5)' }}
                        end={{ transform: 'translateX(0)' }}
                        duration={0.3}
                    >
                        <img src="1006811.gif" alt="Description" style={{ width: '100%' }} />
                    </Animate>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;