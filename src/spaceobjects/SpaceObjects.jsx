// SpaceObjects.jsx
import React, { useEffect, useRef } from 'react';
import { initializeGame } from '../gameSimulation/gameSimulation.js';

const SpaceObjects = ({ theme }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const { cleanup } = initializeGame(containerRef.current);

      // Cleanup on component unmount
      return () => {
        cleanup();
      };
    }
  }, [theme]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    />
  );
};

export default SpaceObjects;
