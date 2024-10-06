// gameSimulation.js
import * as THREE from 'three';
import { createShip } from './ship.js';
import { createPlanets } from './planets.js';
import { PhysicsManager } from './physics.js';
import { initializeControls } from './controls.js';
import { CameraManager } from './camera.js';

export function initializeGame(container) {
  // Basic Setup
  const scene = new THREE.Scene();

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light (e.g., from the Sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 100, 100);
  scene.add(directionalLight);

  // Create Planets using the new function
  const celestialBodies = createPlanets(scene);

  // Get Sun object
  const sun = celestialBodies.find((body) => body.name === 'Sun');

  // Get sun's position
  const sunPosition = new THREE.Vector3();
  sun.getWorldPosition(sunPosition);

  // Camera Manager - Pass sunPosition to focus on the Sun
  const cameraManager = new CameraManager(container, sunPosition);
  const currentCamera = cameraManager.getCurrentCamera();

  // Handle window resize
  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    cameraManager.onWindowResize();
  });

  // Create Ship
  const ship = createShip(scene);

  // Get Earth object
  const earth = celestialBodies.find((body) => body.name === 'Earth');

  // Set ship's initial position relative to Earth
  const earthRadius = earth.geometry.boundingSphere
    ? earth.geometry.boundingSphere.radius
    : earth.geometry.parameters.radius;

  const earthPosition = new THREE.Vector3();
  earth.getWorldPosition(earthPosition);

  ship.position.copy(earthPosition).add(new THREE.Vector3(0, earthRadius + 10, 0));

  // Initialize Physics Manager
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

  // HUD elements (FPS Display, Ship Coordinates, HUD Display)
  const fpsDisplay = document.createElement('div');
  fpsDisplay.style.position = 'absolute';
  fpsDisplay.style.top = '10px';
  fpsDisplay.style.right = '10px';
  fpsDisplay.style.color = 'white';
  fpsDisplay.style.fontSize = '16px';
  fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  fpsDisplay.style.padding = '5px';
  container.appendChild(fpsDisplay);

  const coordsDisplay = document.createElement('div');
  coordsDisplay.style.position = 'absolute';
  coordsDisplay.style.top = '40px';
  coordsDisplay.style.right = '10px';
  coordsDisplay.style.color = 'white';
  coordsDisplay.style.fontSize = '16px';
  coordsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  coordsDisplay.style.padding = '5px';
  container.appendChild(coordsDisplay);

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

    // Update physics
    physicsManager.update(deltaTime);

    // Update Camera
    cameraManager.updateCamera(ship);

    // Update Ship Coordinates
    const { x, y, z } = ship.position;
    coordsDisplay.textContent = `Ship Coordinates: x=${x.toFixed(2)}, y=${y.toFixed(2)}, z=${z.toFixed(2)}`;

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
    // Remove HUD elements
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
