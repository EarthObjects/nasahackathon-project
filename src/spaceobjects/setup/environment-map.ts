import * as THREE from "three";

const cubeTextureLoader = new THREE.CubeTextureLoader();

export const createEnvironmentMap = (directory: string) =>
  cubeTextureLoader.load([
    `${directory}/darker.png`,
      `${directory}/darker.png`,
      `${directory}/darker.png`,
      `${directory}/darker.png`,
      `${directory}/darker.png`,
      `${directory}/darker.png`,
  ]);
