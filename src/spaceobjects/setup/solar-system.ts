// solar-system.ts
import { SpaceObject, Body } from './planetary-object';
import planetData from '../planets.json';
import * as THREE from 'three';

export type SolarSystem = Record<string, SpaceObject>;

export function createSpaceObjects(
  scene: THREE.Scene
): [SolarSystem, string[]] {
  const solarSystem: SolarSystem = {};
  let textureCount = 0;

  const planets: Body[] = planetData as Body[];
  const traversable: string[] = [];

  for (const planet of planets) {
    const name = planet.name;

    if (planet.period === 0 && planet.orbits && solarSystem[planet.orbits]) {
      planet.period = planet.daylength / solarSystem[planet.orbits].data.daylength;
    }

    const object = new SpaceObject(planet);

    solarSystem[name] = object;

    textureCount += Object.keys(planet.textures).length;

    if (object.orbits && solarSystem[object.orbits]) {
      // Add the orbit pivot to the parent object's orbit pivot
      const parentObject = solarSystem[object.orbits];
      parentObject.orbitPivot.add(object.orbitPivot);
    } else {
      // Add the orbit pivot to the scene (for the Sun or objects without a parent)
      scene.add(object.orbitPivot);
    }

    if (planet.traversable) {
      traversable.push(planet.name);
    }
  }

  // No need to add the Sun's mesh separately; it's already added via its orbitPivot

  return [solarSystem, traversable];
}
