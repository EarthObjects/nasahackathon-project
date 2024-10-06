import * as THREE from "three";

const cubeTextureLoader = new THREE.CubeTextureLoader();

export const createDarkEnvironmentMap = (directory: string) =>
    cubeTextureLoader.load([
      `${directory}/darker2.png`,
      `${directory}/darker2.png`,
      `${directory}/darker2.png`,
      `${directory}/darker2.png`,
      `${directory}/darker2.png`,
      `${directory}/darker2.png`,
    ]);