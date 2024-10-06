import React from "react";
import { Card, CardContent, Typography, Button, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import FlareIcon from '@mui/icons-material/Flare';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Brightness3Icon from '@mui/icons-material/Brightness3';

const Detail = ({ item, onBack, onPlanetOpen }) => {
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'image':
                return <ImageIcon />;
            case 'flare':
                return <FlareIcon />;
            case 'auto':
                return <AutoAwesomeIcon />;
            case 'warning':
                return <WarningAmberIcon />;
            case 'moon':
                return <Brightness3Icon />;
            default:
                return null;
        }
    };

    const handlePlanetOpen = () => {
        if (onPlanetOpen) {
            onPlanetOpen(item);
        }
        const event = new CustomEvent('switchCamera', { detail: { planetName: item.primary } });
        window.dispatchEvent(event);
    };

    return (
        <Card>
            <CardContent>
                <Button variant="contained" color="primary" onClick={onBack} sx={{ mb: 2 }}>
                    <ArrowBackIcon />
                </Button>
                {item.avatar == "flare" || item.avatar == "auto" || item.avatar === "warning" || item.avatar === "moon" ? (
                    <Avatar sx={{ mb: 2 }}>
                        {getIcon(item.avatar)}
                    </Avatar>
                ) : (
                    <Avatar src={item.avatar} alt={item.primary} />
                )}
                <Typography variant="h5" component="div">
                    {item.primary}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {item.secondary}
                </Typography>
                <Button variant="contained" color="secondary" onClick={handlePlanetOpen}>
                    Open
                </Button>
            </CardContent>
        </Card>
    );
};

export default Detail;
