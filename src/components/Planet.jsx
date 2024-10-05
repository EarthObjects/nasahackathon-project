import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';

function Planet({ name }) {
    const mesh = useRef();
    const texture = new TextureLoader().load(`/textures/planets/${name.toLowerCase()}.jpg`);

    useFrame(() => {
        mesh.current.rotation.y += 0.001;
    });

    return (
        <mesh ref={mesh}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    );
}

export default Planet;
