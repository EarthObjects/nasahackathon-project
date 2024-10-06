// planetary-object.ts
import * as THREE from 'three';

export interface Textures {
  map?: string;
  bump?: string;
  specular?: string;
  atmosphere?: string;
  atmosphereAlpha?: string;
  [key: string]: string | undefined;
}

export interface Body {
  name: string;
  radius: number;
  mass?: number;
  distance: number;
  period: number;
  daylength: number;
  type: string;
  orbits?: string;
  tilt?: number;
  traversable?: boolean;
  textures: Textures;
  labels?: Array<{ name: string; type?: string; y: number; z: number }>;
}

export class SpaceObject {
  data: Body;
  name: string;
  orbits?: string;
  type: string;
  tilt: number;
  rotationSpeed: number; // radians per time unit
  orbitSpeed: number; // radians per time unit
  distance: number;
  mesh: THREE.Mesh;
  orbitPivot: THREE.Object3D; // Orbit pivot point

  constructor(data: Body) {
    this.data = data;
    this.name = data.name;
    this.orbits = data.orbits;
    this.type = data.type;
    this.tilt = data.tilt || 0;
    this.rotationSpeed = (2 * Math.PI) / (data.daylength || 1); // radians per time unit
    this.orbitSpeed = data.period ? (2 * Math.PI) / data.period : 0; // radians per time unit
    this.distance = data.distance || 0;
    this.mesh = this.createMesh();
    this.mesh.userData.spaceObject = this; // Set reference back to this object

    // Create the orbit pivot
    this.orbitPivot = new THREE.Object3D();
    this.orbitPivot.add(this.mesh);
  }

  createMesh(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(this.data.radius, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff }); // Placeholder color
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = THREE.MathUtils.degToRad(this.tilt);

    // Load textures if provided
    if (this.data.textures && this.data.textures.map) {
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(this.data.textures.map);
      material.map = texture;
      material.needsUpdate = true;
    }

    // Set initial position relative to the orbit pivot
    mesh.position.set(this.distance, 0, 0);

    return mesh;
  }

  tick(deltaTime: number) {
    // Rotate the planet around its own axis
    this.mesh.rotation.y += this.rotationSpeed * deltaTime;

    // Rotate the orbit pivot to simulate orbiting around the parent body
    if (this.orbitSpeed !== 0) {
      this.orbitPivot.rotation.y += this.orbitSpeed * deltaTime;
    }
  }
}
