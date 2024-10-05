import React from 'react';
import { Grid, Typography, List, ListItem, ListItemText, Avatar, ListItemAvatar, Button } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

const ListSection = ({ title, items }) => {
    const iconMap = {
        image: <ImageIcon />,
        work: <WorkIcon />,
        beach: <BeachAccessIcon />
    };

    return (
        <Grid sx={{ mt: 0, mb: 5 }}>
            <Typography variant="h6" component="div" gutterBottom>
                {title}
            </Typography>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {items.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar>
                                {iconMap[item.icon]}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.primary} secondary={item.secondary} />
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                View More
            </Button>
        </Grid>
    );
};

export default ListSection;