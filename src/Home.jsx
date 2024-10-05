import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';


import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Planet from './components/Planet';

function Home() {
    const [planets, setPlanets] = useState([]);
    const [asteroids, setAsteroids] = useState([]);

    useEffect(() => {
        // Fetch planet data from an API or load from a local source
        setPlanets([
            { name: "Sun", position: [0, 0, 0], size: 5 },
            { name: "Earth", position: [30, 0, 0], size: 1 },
            // Add more planets as needed
        ]);
    }, []);

    return (
        <Container sx={{ mt: 12 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Grid>
                        <Typography variant="h6" component="div" gutterBottom>
                            Objects
                        </Typography>
                        <List>
                            {planets.map((planet, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={planet.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid>
                        <Typography variant="h6" component="div" gutterBottom>
                            Asteroids
                        </Typography>
                        <List>
                            {asteroids.map((asteroid, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={asteroid.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[0, 0, 0]} intensity={3.5} />
                        <Stars />
                        {planets.map((planet, index) => (
                            <Planet key={index} name={planet.name} position={planet.position} size={planet.size} />
                        ))}
                        <OrbitControls />
                    </Canvas>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;
