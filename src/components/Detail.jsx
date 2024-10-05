import React from 'react';
import { Card, CardContent, Typography, Button, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachIcon from '@mui/icons-material/BeachAccess';

const Detail = ({ item, onBack }) => {
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'image':
                return <ImageIcon />;
            case 'work':
                return <WorkIcon />;
            case 'beach':
                return <BeachIcon />;
            default:
                return null;
        }
    };

    return (
        <Card>
            <CardContent>
                <Button variant="contained" color="primary" onClick={onBack} sx={{ mb: 2 }}>
                    <ArrowBackIcon />
                </Button>
                <Avatar sx={{ mb: 2 }}>
                    {getIcon(item.icon)}
                </Avatar>
                <Typography variant="h5" component="div">
                    {item.primary}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {item.secondary}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Detail;