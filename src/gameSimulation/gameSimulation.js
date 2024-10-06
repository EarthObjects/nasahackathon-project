import * as THREE from 'three';
import { createShip } from './ship.js';
import { createPlanets } from './planets.js';
import { PhysicsManager } from './physics.js';
import { initializeControls } from './controls.js';
import { CameraManager } from './camera.js';

export function initializeGame(container) {
  // Basic Setup
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Camera Manager
  const cameraManager = new CameraManager(container);
  let currentCamera = cameraManager.getCurrentCamera();

  // Handle window resize
  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    cameraManager.onWindowResize();
  });

  // Create Ship
  const ship = createShip(scene);

  // Create Planets
  const celestialBodies = createPlanets(scene);

  // Get Sun object
  const sun = celestialBodies.find((body) => body.name === 'Sun');

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Dim ambient light
  scene.add(ambientLight);

  const sunLight = new THREE.PointLight(0xffffff, 1.5, 5000); // Adjust range as needed
  sunLight.position.copy(sun.position);
  scene.add(sunLight);

  // Variables for Ship Movement
  ship.rotation.set(0, 0, 0);

  // Get Earth object
  const earth = celestialBodies.find((body) => body.name === 'Earth');

  // Set ship's initial position relative to Earth
  ship.position.copy(earth.position).add(new THREE.Vector3(0, 10, 0));

  // Initialise Physics Manager
  const physicsManager = new PhysicsManager(ship, celestialBodies);

  // Attach the Three.js mesh to the Cannon.js body
  physicsManager.shipBody.threeMesh = ship;

  let previousTime = performance.now();
  let animationFrameId;

  // Controls
  const { cleanup: controlsCleanup } = initializeControls(
    cameraManager,
    renderer.domElement,
    ship,
    physicsManager
  );

  // FPS Display Setup
  const fpsDisplay = document.createElement('div');
  fpsDisplay.style.position = 'absolute';
  fpsDisplay.style.top = '10px';
  fpsDisplay.style.right = '10px';
  fpsDisplay.style.color = 'white';
  fpsDisplay.style.fontSize = '16px';
  fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  fpsDisplay.style.padding = '5px';
  container.appendChild(fpsDisplay);

  // Ship Coordinates Display Setup
  const coordsDisplay = document.createElement('div');
  coordsDisplay.style.position = 'absolute';
  coordsDisplay.style.top = '40px';
  coordsDisplay.style.right = '10px';
  coordsDisplay.style.color = 'white';
  coordsDisplay.style.fontSize = '16px';
  coordsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  coordsDisplay.style.padding = '5px';
  container.appendChild(coordsDisplay);

  // HUD Display Setup
  const hudDisplay = document.createElement('div');
  hudDisplay.style.position = 'absolute';
  hudDisplay.style.bottom = '10px';
  hudDisplay.style.left = '10px';
  hudDisplay.style.color = 'white';
  hudDisplay.style.fontSize = '16px';
  hudDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  hudDisplay.style.padding = '5px';
  container.appendChild(hudDisplay);

  let frameCount = 0;
  let accumulatedTime = 0;

  // Animation Loop
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    const currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 1000; // in seconds
    previousTime = currentTime;

    frameCount++;
    accumulatedTime += deltaTime;

    // Update FPS every second
    if (accumulatedTime >= 1) {
      const fps = Math.round(frameCount / accumulatedTime);
      fpsDisplay.textContent = `FPS: ${fps}`;
      frameCount = 0;
      accumulatedTime = 0;
    }

    // Update Ship Coordinates
    const { x, y, z } = ship.position;
    ship.position.set(10, y, z);
    coordsDisplay.textContent = `Ship Coordinates: x=${x.toFixed(2)}, y=${y.toFixed(2)}, z=${z.toFixed(2)}`;

    // Update Physics
    physicsManager.update(deltaTime);

    // Update Camera
    cameraManager.updateCamera(ship);

    // Update HUD
    const speed = physicsManager.shipBody.velocity.length().toFixed(2);
    const fuel = physicsManager.getFuel().toFixed(2);
    hudDisplay.textContent = `Speed: ${speed} units/s\nFuel: ${fuel} units`;

    // Render Scene
    renderer.render(scene, cameraManager.getCurrentCamera());
  }
  animate();

  // Cleanup function
  const cleanup = () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    controlsCleanup();
    renderer.dispose();
    // Remove scene children
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
    // Remove renderer from DOM
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    // Remove FPS, Coordinates, and HUD displays
    if (fpsDisplay && fpsDisplay.parentNode) {
      fpsDisplay.parentNode.removeChild(fpsDisplay);
    }
    if (coordsDisplay && coordsDisplay.parentNode) {
      coordsDisplay.parentNode.removeChild(coordsDisplay);
    }
    if (hudDisplay && hudDisplay.parentNode) {
      hudDisplay.parentNode.removeChild(hudDisplay);
    }
  };

  return { cleanup };
}
