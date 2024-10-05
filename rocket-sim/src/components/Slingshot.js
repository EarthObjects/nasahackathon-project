import React, { useRef, useState } from "react";
import { useSphere } from "@react-three/cannon";

const Slingshot = () => {
  const [active, setActive] = useState(false);
  const [birdRef, api] = useSphere(() => ({
    mass: 1,
    position: [0, 0.5, 0], // Position the bird above the platform
    args: [0.5],
  }));

  const handleClick = () => {
    if (!active) {
      api.velocity.set(5, 5, 0); // Launch velocity
      setActive(true);
    }
  };

  return (
    <mesh ref={birdRef} onClick={handleClick}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default Slingshot;
