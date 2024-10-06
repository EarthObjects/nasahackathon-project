import React from "react";
import { Card, CardContent, Typography, Button, Avatar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ImageIcon from "@mui/icons-material/Image";
<<<<<<< Updated upstream
import WorkIcon from "@mui/icons-material/Work";
import BeachIcon from "@mui/icons-material/BeachAccess";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
=======
import FlareIcon from "@mui/icons-material/Flare";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Brightness3Icon from "@mui/icons-material/Brightness3";
>>>>>>> Stashed changes

<<<<<<< Updated upstream
const Detail = ({ item, onBack }) => {
=======
const Detail = ({ item, onBack, onPlanetOpen }) => {
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  const getIcon = (iconName) => {
    switch (iconName) {
      case "image":
        return <ImageIcon />;
<<<<<<< Updated upstream
      case "work":
        return <WorkIcon />;
      case "beach":
        return <BeachIcon />;
      case "warning":
        return <WarningAmberIcon />;
=======
      case "flare":
        return <FlareIcon />;
      case "auto":
        return <AutoAwesomeIcon />;
      case "warning":
        return <WarningAmberIcon />;
      case "moon":
        return <Brightness3Icon />;
>>>>>>> Stashed changes
      default:
        return null;
    }
  };

<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
>>>>>>> Stashed changes
  const handlePlanetOpen = () => {
    if (onPlanetOpen) {
      onPlanetOpen(item);
    }
    const event = new CustomEvent("switchCamera", {
      detail: { planetName: item.primary },
    });
    window.dispatchEvent(event);
  };

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
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
<<<<<<< Updated upstream
        {item.avatar === "work" || item.avatar === "beach" ? (
          <Avatar>{iconMap[item.avatar]}</Avatar>
=======
        {item.avatar == "flare" ||
        item.avatar == "auto" ||
        item.avatar === "warning" ||
        item.avatar === "moon" ? (
          <Avatar sx={{ mb: 2 }}>{getIcon(item.avatar)}</Avatar>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
        <Typography variant="body2" color="text.secondary">
          {item.third}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.fourth}
        </Typography>
=======
>>>>>>> Stashed changes
        <Button
          variant="contained"
          color="secondary"
          onClick={handlePlanetOpen}
        >
          Open Planet
        </Button>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      </CardContent>
    </Card>
  );
};

export default Detail;
