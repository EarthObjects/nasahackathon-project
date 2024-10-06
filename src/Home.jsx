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

function Home({ isListVisible, currentList }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [asteroids, setAsteroids] = useState([]); // State for asteroids data
  const [comets, setComets] = useState([]); // State for comets data
  const [planets, setPlanets] = useState([]); // State for planets data
  const [moons, setMoons] = useState([]); // State for moons data
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
          : "work"; // Replace with the path to your default icon

        console.log("Wikipic URL:", wikipicUrl); // Log the asteroid name and its wikipic URL

        return {
          primary: asteroid.name,
          secondary: `Inclination: ${asteroid.inc}, Omega: ${asteroid.omega}`,
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
          : "beach"; // Replace with the path to your default icon

        console.log("Wikipic URL:", wikipicUrl); // Log the comet name and its wikipic URL

        return {
          primary: comet.name,
          secondary: `Inclination: ${comet.inc}, Omega: ${comet.omega}`,
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

        console.log("Wikipic URL:", wikipicUrl); // Log the planet name and its wikipic URL

        return {
          primary: planet.name,
          secondary: `Inclination: ${planet.inc}, Omega: ${planet.omega}`,
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
          : "work"; // Replace with the path to your default icon

        console.log("Wikipic URL:", wikipicUrl); // Log the moon name and its wikipic URL

        return {
          primary: moon.name,
          secondary: `Inclination: ${moon.inc}, Omega: ${moon.omega}`,
          avatar: wikipicUrl,
        };
      });
      setMoons(formattedData); // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching moons:", error);
      setError(error.message); // Set error state
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading state to true
      await fetchAsteroids();
      await fetchComets();
      await fetchPlanets(); // Fetch planets data
      await fetchMoons(); // Fetch moons data
      setLoading(false); // Set loading state to false when done
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array to run once on component mount

  const potentialHazardous = [
    {
      primary: "Object 1",
      secondary: "203,201 km from Earth",
      icon: "warning",
    },
    {
      primary: "Asteroid 1",
      secondary: "203,201 km from Earth",
      icon: "warning",
    },
    { primary: "Comet 1", secondary: "203,201 km from Earth", icon: "warning" },
  ];

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
      case "potential_Hazardous":
        return potentialHazardous;
      case "all":
        return [
          ...planets,
          ...asteroids,
          ...comets,
          ...moons,
          ...potentialHazardous,
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
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
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
