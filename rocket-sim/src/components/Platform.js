import React from "react";
import { useBox } from "@react-three/cannon";

const Platform = () => {
  const [ref] = useBox(() => ({
    position: [0, 0, 0], // Position the platform at the origin
    args: [5, 0.5, 5], // Width, height, depth
    isStatic: true, // Make the platform static
  }));

  return (
    <mesh ref={ref}>
      <boxGeometry args={[5, 0.5, 5]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};

export default Platform;
