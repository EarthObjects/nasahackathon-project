import React from 'react';
import Asteroid from './Asteroid';

function AsteroidBelt({ count = 500, innerRadius = 20, outerRadius = 30 }) {
    const asteroids = [];

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * (outerRadius - innerRadius) + innerRadius;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = (Math.random() - 0.5) * 2; // Small vertical displacement

        const size = Math.random() * 0.2 + 0.05; // Random size for variation

        asteroids.push(
            <Asteroid key={i} position={[x, y, z]} size={size} />
        );
    }

    return <group>{asteroids}</group>;
}

export default AsteroidBelt;
