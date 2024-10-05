import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';

function Asteroid({ position, size, speed }) {
    const mesh = useRef();
    const texture = new TextureLoader().load('/textures/asteroid.jpg');

    // Initial angle 
    const angleRef = useRef(Math.atan2(position[2], position[0]));
    const radius = Math.sqrt(position[0] ** 2 + position[2] ** 2);

    useFrame(() => {
        angleRef.current += speed;

        const x = radius * Math.cos(angleRef.current);
        const z = radius * Math.sin(angleRef.current);

        mesh.current.position.set(x, position[1], z);
        mesh.current.rotation.x += 0.01;
        mesh.current.rotation.y += 0.01;
    });

    return (
        <mesh ref={mesh} position={position}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}

export default Asteroid;
