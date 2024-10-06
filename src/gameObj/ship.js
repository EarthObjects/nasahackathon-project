// ship.js
import * as THREE from 'three';

export function createShip() {
  const radius = 0.05;
  const length = 0.1;
  const capGeometry = new THREE.CapsuleGeometry(radius, length, 0.05, 16);
  const capMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  const ship = new THREE.Mesh(capGeometry, capMaterial);
  ship.mass = 10; // Define the mass for physics calculations

  return ship;
}