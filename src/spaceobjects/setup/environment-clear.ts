import * as THREE from "three";

const cubeTextureLoader = new THREE.CubeTextureLoader();

export const createClearEnvironmentMap = (directory: string) =>
  cubeTextureLoader.load([
    `${directory}/transparent.png`,
      `${directory}/transparent.png`,
      `${directory}/transparent.png`,
      `${directory}/transparent.png`,
      `${directory}/transparent.png`,
      `${directory}/transparent.png`,
  ]);
