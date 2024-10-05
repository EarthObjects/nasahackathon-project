import React, {useState} from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Animate } from 'react-simple-animate';
import ListSection from "./components/ListSection.jsx";

function Home({isListVisible}) {

    const objects = [
        { primary: 'Object 1', secondary: '203,201 km from Earth', icon: 'image' },
        { primary: 'Object 2', secondary: '2,032,051 km from Earth', icon: 'work' },
        { primary: 'Object 3', secondary: '2,032,214,351 km from Earth', icon: 'beach' }
    ];

    const asteroids = [
        { primary: 'Asteroid 1', secondary: '203,201 km from Earth', icon: 'image' },
        { primary: 'Asteroid 2', secondary: '2,032,051 km from Earth', icon: 'work' },
        { primary: 'Asteroid 3', secondary: '2,032,214,351 km from Earth', icon: 'beach' }
    ];

    const comets = [
        { primary: 'Comet 1', secondary: '203,201 km from Earth', icon: 'image' },
        { primary: 'Comet 2', secondary: '2,032,051 km from Earth', icon: 'work' },
        { primary: 'Comet 3', secondary: '2,032,214,351 km from Earth', icon: 'beach' }
    ];

    return (
        <Container sx={{ mt: 12 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={isListVisible ? 4 : 12}>
                    <Animate
                        play={isListVisible}
                        start={{ opacity: 0, transform: 'translateX(-100%)' }}
                        end={{ opacity: 1, transform: 'translateX(0)' }}
                        duration={0.3}
                    >
                {isListVisible && (
                    <div>
                        <ListSection title="Objects" items={objects}/>
                        <ListSection title="Asteroids" items={asteroids}/>
                        <ListSection title="Comets" items={comets}/>
                    </div>
                )}
                    </Animate>
                </Grid>
                <Grid item xs={12} md={isListVisible ? 8 : 12}>
                    <Animate
                        play={!isListVisible}
                        start={{transform: 'scale(1)'}}
                        end={{transform: 'scale(1.5)' }}
                        duration={0.3}
                    >
                    <img src="test.png" alt="Description" style={{ width: '100%' }} />
                    </Animate>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;