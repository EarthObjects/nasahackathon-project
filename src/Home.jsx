import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Animate } from "react-simple-animate";
import ListSection from "./components/ListSection.jsx";
import Detail from "./components/Detail.jsx";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SpaceObjects from "./spaceobjects/SpaceObjects.jsx";
import GradientCircularProgress from "./components/GradientCircularProgress";

function Home({ isListVisible, currentList }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [asteroids, setAsteroids] = useState([]); // State for asteroids data
  const [comets, setComets] = useState([]); // State for comets data
  const [planets, setPlanets] = useState([]); // State for planets data
  const [moons, setMoons] = useState([]); // State for moons data
  const [potentialHazards, setPotentialHazards] = useState([]); // State for potential hazards data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const theme = useTheme();

  // Fetch asteroids data from the backend
  const fetchAsteroids = async () => {
    try {
      const response = await fetch(
        "https://spacebackend-production.up.railway.app/asteroids/",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch asteroids");
      }
      const data = await response.json();
      const formattedData = data.map((asteroid) => {
        const wikipicUrl = asteroid.wikipic
          ? `https://upload.wikimedia.org/wikipedia/commons/${asteroid.wikipic}`
          : "flare"; // Replace with the path to your default icon

        return {
          primary: asteroid.name,
          secondary: `Inclination: ${asteroid.inc}, Omega: ${asteroid.omega}`,
          third: `Info: ${asteroid.info}`,
          fourth: `Type: ${asteroid.type}`,
          avatar: wikipicUrl,
        };
      });
      setAsteroids(formattedData); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching asteroids:", error);
      setError(error.message); // Set error state
    }
  };

  // Fetch comets data from the backend
  const fetchComets = async () => {
    try {
      const response = await fetch(
        "https://spacebackend-production.up.railway.app/comets/",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch comets");
      }
      const data = await response.json();
      const formattedData = data.map((comet) => {
        const wikipicUrl = comet.wikipic
          ? `https://upload.wikimedia.org/wikipedia/commons/${comet.wikipic}`
          : "auto"; // Replace with the path to your default icon

        return {
          primary: comet.name,
          secondary: `Inclination: ${comet.inc}, Omega: ${comet.omega}`,
          third: `Info: ${comet.info}`,
          fourth: `Radius: ${comet.radius}`,
          avatar: wikipicUrl,
        };
      });
      setComets(formattedData); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching comets:", error);
      setError(error.message); // Set error state
    }
  };

  // Fetch planets data from the backend
  const fetchPlanets = async () => {
    try {
      const response = await fetch(
        "https://spacebackend-production.up.railway.app/planets/",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch planets");
      }
      const data = await response.json();
      const formattedData = data.map((planet) => {
        const wikipicUrl = planet.wikipic
          ? `https://upload.wikimedia.org/wikipedia/commons/${planet.wikipic}`
          : "image"; // Replace with the path to your default icon

        return {
          primary: planet.name,
          secondary: `Inclination: ${planet.inc}, Omega: ${planet.omega}`,
          third: `Info: ${planet.info}`,
          fourth: `Radius: ${planet.radius}`,
          avatar: wikipicUrl,
        };
      });
      setPlanets(formattedData); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching planets:", error);
      setError(error.message); // Set error state
    }
  };

  // Fetch moons data from the backend
  const fetchMoons = async () => {
    try {
      const response = await fetch(
        "https://spacebackend-production.up.railway.app/moons/",
      );
      if (!response.ok) {
        throw new Error("Failed to fetch moons");
      }
      const data = await response.json();
      const formattedData = data.map((moon) => {
        const wikipicUrl = moon.wikipic
          ? `https://upload.wikimedia.org/wikipedia/commons/${moon.wikipic}`
          : "moon"; // Replace with the path to your default icon

        return {
          primary: moon.name,
          secondary: `Inclination: ${moon.inc}, Omega: ${moon.omega}`,
          third: `Info: ${moon.info}`,
          fourth: `Radius: ${moon.radius}`,
          avatar: wikipicUrl,
        };
      });
      setMoons(formattedData); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching moons:", error);
      setError(error.message); // Set error state
    }
  };

  const fetchHazards = async () => {
    try {
      const response = await fetch("https://spacebackend-production.up.railway.app/hazards/");
      if (!response.ok) {
        throw new Error("Failed to fetch hazards");
      }
      const data = await response.json();
      const hazards = [];

      Object.keys(data.near_earth_objects).forEach(date => {
        data.near_earth_objects[date].forEach(neo => {
          if (neo.is_potentially_hazardous_asteroid) {
            hazards.push({
              id: neo.id,
              primary: neo.name,
              secondary: date,
              magnitude: neo.absolute_magnitude_h,
              diameter_min: neo.estimated_diameter.meters.estimated_diameter_min,
              diameter_max: neo.estimated_diameter.meters.estimated_diameter_max,
              third: `Velocity: ${neo.close_approach_data[0].relative_velocity.kilometers_per_hour} km/h`,
              fourth: `Miss distance: ${neo.close_approach_data[0].miss_distance.kilometers} km`,
              orbiting_body: neo.close_approach_data[0].orbiting_body,
              avatar: "warning",
            });
          }
        });
      });

      setPotentialHazards(hazards);
    } catch (error) {
      console.error("Error fetching moons:", error);
      setError(error.message);
    }
  };


  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading state to true
      await fetchAsteroids();
      await fetchComets();
      await fetchPlanets(); // Fetch planets data
      await fetchMoons();
      await fetchHazards();// Fetch moons data
      setLoading(false); // Set loading state to false when done
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array to run once on component mount

  // Get list items dynamically based on the current view
  const getListItems = () => {
    switch (currentList) {
      case "planets":
        return planets;
      case "moons":
        return moons;
      case "asteroids":
        return asteroids; // Replaced with fetched asteroids
      case "comets":
        return comets; // Replaced with fetched comets
      case "potential_Hazards":
        return potentialHazards;
      case "all":
        return [
          ...planets,
          ...asteroids,
          ...comets,
          ...moons,
          ...potentialHazards,
        ];
      default:
        return [];
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleBack = () => {
    setSelectedItem(null);
  };

  // Loading and error states
  if (loading) {
    return <GradientCircularProgress />;
  }

  if (error) {
    return <p>Error fetching data: {error}</p>;
  }

  return (
    <Container style={{ backgroundColor: theme.palette.background.default }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={isListVisible ? 4 : 4}>
          <Animate
            play={isListVisible}
            start={{ opacity: 0, transform: "translateX(-100%)" }}
            end={{ opacity: 1, transform: "translateX(0)" }}
            duration={0.3}
          >
            {isListVisible && !selectedItem && (
              <div>
                <ListSection
                  title={currentList}
                  items={getListItems()}
                  onViewMore={() => {}}
                  onItemClick={handleItemClick}
                />
              </div>
            )}
            {selectedItem && <Detail item={selectedItem} onBack={handleBack} />}
          </Animate>
        </Grid>
        <Grid item xs={12} md={isListVisible ? 8 : 8}>
          <Animate
            play={isListVisible}
            start={{ transform: "translateX(-25%) scale(1.5)" }}
            end={{ transform: "translateX(0)" }}
            duration={0.3}
          >
            <SpaceObjects
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
              theme={theme}
            />
          </Animate>
        </Grid>
      </Grid>
      <Box
        component="section"
        sx={{ p: 8, backgroundColor: theme.palette.background.default }}
      ></Box>
      <Box
        component="section"
        sx={{ p: 5, backgroundColor: theme.palette.background.default }}
      >
        <Typography sx={{ color: theme.palette.text.disabled }}>
          Made with ❤ by the Runtime Terror team
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;
