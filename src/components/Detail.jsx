import React from "react";
import { Card, CardContent, Typography, Button, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachIcon from "@mui/icons-material/BeachAccess";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

<<<<<<< Updated upstream
const Detail = ({ item, onBack }) => {
=======
const Detail = ({ item, onBack, onPlanetOpen }) => {
>>>>>>> Stashed changes
  const getIcon = (iconName) => {
    switch (iconName) {
      case "image":
        return <ImageIcon />;
      case "work":
        return <WorkIcon />;
      case "beach":
        return <BeachIcon />;
      case "warning":
        return <WarningAmberIcon />;
      default:
        return null;
    }
  };

<<<<<<< Updated upstream
=======
  const handlePlanetOpen = () => {
    if (onPlanetOpen) {
      onPlanetOpen(item);
    }
    const event = new CustomEvent("switchCamera", {
      detail: { planetName: item.primary },
    });
    window.dispatchEvent(event);
  };

>>>>>>> Stashed changes
  return (
    <Card>
      <CardContent>
        <Button
          variant="contained"
          color="primary"
          onClick={onBack}
          sx={{ mb: 2 }}
        >
          <ArrowBackIcon />
        </Button>
        {item.avatar === "work" || item.avatar === "beach" ? (
          <Avatar>{iconMap[item.avatar]}</Avatar>
        ) : (
          <Avatar src={item.avatar} alt={item.primary} />
        )}
        <Typography variant="h5" component="div">
          {item.primary}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.secondary}
        </Typography>
<<<<<<< Updated upstream
=======
        <Typography variant="body2" color="text.secondary">
          {item.third}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.fourth}
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePlanetOpen}
        >
          Open Planet
        </Button>
>>>>>>> Stashed changes
      </CardContent>
    </Card>
  );
};

export default Detail;
