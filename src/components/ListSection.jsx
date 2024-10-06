import React from "react";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Brightness3Icon from '@mui/icons-material/Brightness3';

import { useTheme } from "@mui/material/styles";
import FlareIcon from "@mui/icons-material/Flare";

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
    flare: <FlareIcon />,
    auto: <AutoAwesomeIcon />,
    moon: <Brightness3Icon/>,
    warning: <WarningAmberIcon />,
  };

  return (
    <Grid sx={{ mt: 0, mb: 5 }}>
      <Typography
        variant="h6"
        component="div"
        gutterBottom
        sx={{ color: theme.palette.text.primary }}
      >
        {title
          ? title.replace(/_/g, " ").charAt(0).toUpperCase() +
            title.replace(/_/g, " ").slice(1)
          : "Default Title"}
      </Typography>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {(showAll ? items : items.slice(0, 4)).map((item, index) => (
          <ListItem
            key={index}
            sx={{
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                cursor: "pointer",
              },
            }}
            onClick={() => onItemClick(item)}
          >
            <ListItemAvatar>
              {/* Use the icon URL for the Avatar */}
              {item.avatar === "flare" || item.avatar === "auto" || item.avatar === "warning" || item.avatar === "moon" ? (
                <Avatar>{iconMap[item.avatar]}</Avatar>
              ) : (
                <Avatar src={item.avatar} alt={item.primary} />
              )}
            </ListItemAvatar>
            <ListItemText primary={item.primary} secondary={item.secondary} />
          </ListItem>
        ))}
      </List>
      {!showAll && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleViewMore}
        >
          View More
        </Button>
      )}
      {showAll && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleViewLess}
        >
          View Less
        </Button>
      )}
    </Grid>
  );
};

export default ListSection;

