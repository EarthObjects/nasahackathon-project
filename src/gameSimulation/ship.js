// ship.js
import * as THREE from 'three';

export function createShip(scene) {
  // Capsule geometry for the ship
  const radius = 0.5;
  const length = 2;
  const capGeometry = new THREE.CapsuleGeometry(radius, length, 8, 16);
  const capMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
  const ship = new THREE.Mesh(capGeometry, capMaterial);
  ship.mass = 10;

  scene.add(ship);

  return ship;
}
