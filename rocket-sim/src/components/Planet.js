import React from "react";
import { useSphere } from "@react-three/cannon";

const Planet = ({ position }) => {
  const [planetRef] = useSphere(() => ({
    mass: 1000,
    position,
    args: [1], // Planet size
    type: "Static",
  }));

  return (
    <mesh ref={planetRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

export default Planet;
