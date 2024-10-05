import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function Home() {
    return (
        <Container sx={{ mt: 12 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Grid>
                    <Typography variant="h6" component="div" gutterBottom>
                        Objects
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="Item 1" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Item 2" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Item 3" />
                        </ListItem>
                    </List>
                    </Grid>
                    <Grid>
                        <Typography variant="h6" component="div" gutterBottom>
                            Asteroids
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText primary="Item 1" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Item 2" />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Item 3" />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <img src="test.png" alt="Description" style={{ width: '100%' }} />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;