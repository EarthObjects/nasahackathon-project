import * as THREE from 'three';

export function createPlanets(scene) {
  const celestialBodies = [];

  // Create Sun
  const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.mass = 10000; // Assign mass
  sun.position.set(0, 0, 0);
  sun.name = 'Sun';
  scene.add(sun);
  celestialBodies.push(sun);

  // Create Earth
  const earthGeometry = new THREE.SphereGeometry(3, 32, 32);
  const earthMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earth.mass = 100;
  earth.name = 'Earth';
  scene.add(earth);
  celestialBodies.push(earth);

  earth.orbit = {
    center: sun.position,
    radius: 50,
    speed: 0.01,
    angle: 0,
  };

  // Create Moon
  const moonGeometry = new THREE.SphereGeometry(1, 32, 32);
  const moonMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.mass = 10;
  moon.name = 'Moon';
  scene.add(moon);
  celestialBodies.push(moon);

  moon.orbit = {
    center: earth.position,
    radius: 10,
    speed: 0.05,
    angle: 0,
  };

  return celestialBodies;
}
