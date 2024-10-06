import * as THREE from "three";

let textureCount = 0;
let texturesLoaded = 0;
const textureLoader = new THREE.TextureLoader();

export const loadTexture = (path: string) => {
  return textureLoader.load(path, () => {
    texturesLoaded++;
  });
};

export const setTextureCount = (n: number) => {
  textureCount = n;
};

