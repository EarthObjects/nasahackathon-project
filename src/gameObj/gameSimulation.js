// gameSimulation.js
import * as THREE from 'three';
import { createShip } from './ship.js';
import { PhysicsManager } from './physics.js';
import { initializeControls } from './controls.js';
import { CameraManager } from './camera.js';

export function initializeGame(scene, celestialBodies, renderer, canvas) {
  // Camera Manager
  const cameraManager = new CameraManager(canvas);
  const currentCamera = cameraManager.getCurrentCamera();

  // Create Ship
  const ship = createShip();
  scene.add(ship);

  // Position the ship near Earth or any other celestial body
  const earth = celestialBodies['Earth'].mesh;
  const earthRadius = earth.geometry.parameters.radius || 1;

  const earthPosition = new THREE.Vector3();
  earth.getWorldPosition(earthPosition);

  ship.position.copy(earthPosition).add(new THREE.Vector3(earthRadius + 10, 0, 0));

  // Initialize Physics Manager
  const physicsManager = new PhysicsManager(ship, Object.values(celestialBodies).map(obj => obj.mesh));

  // Controls
  const { cleanup: controlsCleanup } = initializeControls(physicsManager.shipBody);

  // Handle window resize
  window.addEventListener('resize', () => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    cameraManager.onWindowResize();
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    const deltaTime = 1 / 60; // Fixed time step for physics

    // Update physics
    physicsManager.update(deltaTime);

    // Update Camera
    cameraManager.updateCamera(ship);

    // Render Scene
    renderer.render(scene, cameraManager.getCurrentCamera());
  }
  animate();

  // Cleanup function
  const cleanup = () => {
    controlsCleanup();
    // Remove event listeners if any
  };

  return { cleanup };
}
