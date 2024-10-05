import React from 'react';
import { Grid, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useTheme } from '@mui/material/styles';

const ListSection = ({ title, items, onViewMore, onItemClick }) => {
    const [showAll, setShowAll] = React.useState(false);
    const theme = useTheme();

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
        beach: <BeachAccessIcon />,
        warning: <WarningAmberIcon />,
    };

    return (
        <Grid sx={{ mt: 0, mb: 5 }}>
            <Typography variant="h6" component="div" gutterBottom sx={{color: theme.palette.text.primary}}>
                {title ? title.replace(/_/g, ' ').charAt(0).toUpperCase() + title.replace(/_/g, ' ').slice(1) : 'Default Title'}
            </Typography>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {(showAll ? items : items.slice(0, 4)).map((item, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            color: theme.palette.text.primary,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                                cursor: 'pointer'
                            }
                        }}
                        onClick={() => onItemClick(item)}
                    >
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