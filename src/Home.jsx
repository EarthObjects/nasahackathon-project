import React, {useState} from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import {Avatar, ListItemAvatar} from "@mui/material";
import Button from "@mui/material/Button";


function Home({isListVisible}) {
    return (
        <Container sx={{ mt: 12 }}>
            <Grid container spacing={2}>
                {isListVisible && (
                <Grid item xs={12} md={6}>
                    <Grid>
                    <Typography variant="h6" component="div" gutterBottom>
                        Objects
                    </Typography>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <ImageIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Object 1" secondary="203,201 km from Earth" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <WorkIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Object 2" secondary="2,032,051km from Earth" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <BeachAccessIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Object 3" secondary="2,032,214,351 km from Earth" />
                            </ListItem>
                        </List>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                            View More
                        </Button>
                    </Grid>
                    <Grid sx={{mt: 5}}>
                        <Typography variant="h6" component="div" gutterBottom>
                            Asteroids
                        </Typography>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <ImageIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Asteroid 1" secondary="203,201 km from Earth" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <WorkIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Asteroid 2" secondary="2,032,051km from Earth" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <BeachAccessIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Asteroid 3" secondary="2,032,214,351 km from Earth" />
                            </ListItem>
                        </List>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                            View More
                        </Button>
                    </Grid>
                    <Grid sx={{mt: 5, mb: 5}}>
                        <Typography variant="h6" component="div" gutterBottom>
                            Comets
                        </Typography>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <ImageIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Comet 1" secondary="203,201 km from Earth" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <WorkIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Comet 2" secondary="2,032,051km from Earth" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <BeachAccessIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Comet 3" secondary="2,032,214,351 km from Earth" />
                            </ListItem>
                        </List>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                            View More
                        </Button>
                    </Grid>
                </Grid>
                )}
                <Grid item xs={12} md={isListVisible ? 6 : 12}>
                    <img src="test.png" alt="Description" style={{ width: '100%' }} />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Home;