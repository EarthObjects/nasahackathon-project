import React, { useState } from 'react';
import { Grid, Typography, List, ListItem, ListItemText, Avatar, ListItemAvatar, Button } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

const ListSection = ({ title = 'Default Title', items, onViewMore }) => {
    const [showAll, setShowAll] = useState(false);

    const handleViewMore = () => {
        setShowAll(true);
        onViewMore();
    };

    const handleViewLess = () => {
        setShowAll(false);
        onViewMore();
    };

    const iconMap = {
        image: <ImageIcon />,
        work: <WorkIcon />,
        beach: <BeachAccessIcon />
    };

    return (
        <Grid sx={{ mt: 0, mb: 5 }}>
            <Typography variant="h6" component="div" gutterBottom>
                {title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Default Title'}
            </Typography>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {(showAll ? items : items.slice(0, 4)).map((item, index) => (
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
            {!showAll && (
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleViewMore}>
                    View More
                </Button>
            )}
            {showAll && (
                <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleViewLess}>
                    View Less
                </Button>
            )}
        </Grid>
    );
};

export default ListSection;