import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import Slingshot from "./components/Slingshot";
import Planet from "./components/Planet";
import GravitySystem from "./components/GravitySystem";
import Platform from "./components/Platform"; // Import the Platform

function App() {
  return (
    <div>
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} />

        <Physics gravity={[0, -9.81, 0]}>
          <Platform /> {/* Add the Platform here */}
          <Slingshot />
          <GravitySystem>
            <Planet position={[5, 0, 0]} />
            <Planet position={[-5, 2, -2]} />
          </GravitySystem>
        </Physics>

        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
