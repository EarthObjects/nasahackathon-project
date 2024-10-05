import React, { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";

const GravitySystem = ({ children }) => {
  const [birdRef, birdApi] = useSphere(() => ({
    mass: 1,
    position: [0, 1, 0],
    args: [0.5],
  }));

  useFrame(() => {
    const planets = React.Children.toArray(children);

    planets.forEach((planet) => {
      const planetPos = planet.props.position;
      const birdPos = birdRef.current.position;

      // Calculate gravitational force based on distance
      const dx = planetPos[0] - birdPos.x;
      const dy = planetPos[1] - birdPos.y;
      const dz = planetPos[2] - birdPos.z;

      const distanceSquared = dx * dx + dy * dy + dz * dz;
      if (distanceSquared === 0) return;

      const gravityForce = 50 / distanceSquared;

      birdApi.applyForce(
        [gravityForce * dx, gravityForce * dy, gravityForce * dz],
        [0, 0, 0],
      );
    });
  });

  return <>{children}</>;
};

export default GravitySystem;
