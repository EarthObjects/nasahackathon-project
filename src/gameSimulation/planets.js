// planets.js
import { createSpaceObjects } from '../spaceobjects/setup/solar-system.ts';

export function createPlanets(scene) {
  // Use the createSpaceObjects function to generate planets
  const [solarSystem, traversable] = createSpaceObjects(scene);

  // Extract celestial bodies from the solar system
  const celestialBodies = Object.values(solarSystem).map((spaceObject) => {
    // Each spaceObject has a mesh property
    const body = spaceObject.mesh;
    body.mass = spaceObject.data.mass || 1; // Assign mass, default to 100 if not specified
    body.name = spaceObject.data.name;
    return body;
  });

  return celestialBodies;
}
