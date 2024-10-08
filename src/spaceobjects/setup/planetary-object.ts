import * as THREE from "three";
import { createRingMesh } from "./rings";
import { loadTexture } from "./textures";
import { Label } from "./label";
import { PointOfInterest } from "./label";

const createPath = (radius: number) => {
  const points: THREE.Vector3[] = [];
  const count = 1024;

  for (let i = 0; i < count; i++) {
    const theta = (i / count) * Math.PI * 2;
    const x = Math.sin(theta);
    const z = Math.cos(theta);
    points.push(new THREE.Vector3(x, 0, z));
  }

  points.push(new THREE.Vector3(0, 0, 1));

  const material = new THREE.LineBasicMaterial({
    color: "white",
    transparent: true,
    opacity: 0.25,
  });

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const mesh = new THREE.Line(geometry, material);
  mesh.scale.set(radius, radius, radius);
  mesh.visible = false;

  return mesh;
};

export interface Body {
  name: string;
  radius: number;
  distance: number;
  period: number;
  daylength: number;
  textures: TexturePaths;
  type: string;
  tilt: number;
  orbits?: string;
  labels?: PointOfInterest[];
  traversable: boolean;
  offset?: number;
  height?: number;
}

interface TexturePaths {
  map: string;
  bump?: string;
  atmosphere?: string;
  atmosphereAlpha?: string;
  specular?: string;
}

interface Atmosphere {
  map?: THREE.Texture;
  alpha?: THREE.Texture;
}

const timeFactor = 8 * Math.PI * 2; // 1s real-time => 8h simulation time

const normaliseRadius = (radius: number): number => {
  return Math.sqrt(radius) / 500;
};

const normaliseDistance = (distance: number): number => {
  return Math.pow(distance, 0.4);
};

const degreesToRadians = (degrees: number): number => {
  return (Math.PI * degrees) / 180;
};

export class SpaceObject {
  radius: number; // in km
  distance: number; // in million km
  period: number; // in days
  daylength: number; // in hours
  orbits?: string;
  type: string;
  tilt: number; // degrees
  mesh: THREE.Mesh;
  path?: THREE.Line;
  rng: number;
  height: number; // New property for y-axis offset
  map: THREE.Texture;
  bumpMap?: THREE.Texture;
  specularMap?: THREE.Texture;
  atmosphere: Atmosphere = {};
  labels: Label;

  constructor(body: Body) {
    const { radius, distance, period, daylength, orbits, type, tilt, height } = body;

    this.radius = normaliseRadius(radius);
    this.distance = normaliseDistance(distance);
    this.period = period;
    this.daylength = daylength;
    this.orbits = orbits;
    this.type = type;
    this.tilt = degreesToRadians(tilt);
    this.rng = body.offset ?? Math.random() * 2 * Math.PI;
    this.height = body.height ?? 0; // Initialize yOffset

    this.loadTextures(body.textures);

    this.loadTextures(body.textures);

    this.mesh = this.createMesh();

    if (this.orbits) {
      this.path = createPath(this.distance);
    }

    if (this.atmosphere.map) {
      this.mesh.add(this.createAtmosphereMesh());
    }

    this.initLabels(body.labels);
  }

  /**
   * Creates label objects for each point-of-interest.
   * @param labels - List of labels to display.
   */
  private initLabels = (labels?: PointOfInterest[]) => {
    this.labels = new Label(this.mesh, this.radius);

    if (labels) {
      labels.forEach((poi) => {
        this.labels.createPOILabel(poi);
      });
    }
  };

  /**
   * Prepare and load textures.
   * @param textures - Object of texture paths to load.
   */
  private loadTextures(textures: TexturePaths) {
    this.map = loadTexture(textures.map);
    if (textures.bump) {
      this.bumpMap = loadTexture(textures.bump);
    }
    if (textures.specular) {
      this.specularMap = loadTexture(textures.specular);
    }
    if (textures.atmosphere) {
      this.atmosphere.map = loadTexture(textures.atmosphere);
    }
    if (textures.atmosphereAlpha) {
      this.atmosphere.alpha = loadTexture(textures.atmosphereAlpha);
    }
  }

  /**
   * Creates the main mesh object with textures.
   * @returns celestial body mesh.
   */
  private createMesh = () => {
    if (this.type === "ring") {
      return createRingMesh(this.map);
    }

    const geometry = new THREE.SphereGeometry(this.radius, 64, 64);
    let material;
    if (this.type === "star") {
      material = new THREE.MeshBasicMaterial({
        map: this.map,
        lightMapIntensity: 2,
        toneMapped: false,
        color: new THREE.Color(2.5, 2.5, 2.5),
      });
    } else {
      material = new THREE.MeshPhongMaterial({
        map: this.map,
        shininess: 5,
        toneMapped: true,
      });

      if (this.bumpMap) {
        material.bumpMap = this.bumpMap;
        material.bumpScale = this.radius / 50;
      }

      if (this.specularMap) {
        material.specularMap = this.specularMap;
      }
    }

    const sphere = new THREE.Mesh(geometry, material);
    sphere.rotation.x = this.tilt;
    sphere.castShadow = true;
    sphere.receiveShadow = true;

    return sphere;
  };

  /**
   * Creates the atmosphere mesh object with textures.
   * @returns atmosphere mesh.
   */
  private createAtmosphereMesh = () => {
    const geometry = new THREE.SphereGeometry(this.radius + 0.0005, 64, 64);

    const material = new THREE.MeshPhongMaterial({
      map: this.atmosphere?.map,
      transparent: true,
    });

    if (this.atmosphere.alpha) {
      material.alphaMap = this.atmosphere.alpha;
    }

    const sphere = new THREE.Mesh(geometry, material);
    sphere.receiveShadow = true;
    sphere.rotation.x = this.tilt;
    return sphere;
  };

  private getRotation = (elapsedTime: number) => {
    return this.daylength ? (elapsedTime * timeFactor) / this.daylength : 0;
  };

  private getOrbitRotation = (elapsedTime: number) => {
    return this.daylength ? (elapsedTime * timeFactor) / (this.period * 24) : 0;
  };

  /**
   * Updates orbital position and rotation.
   * @param elapsedTime - number of seconds elapsed.
   */
  tick = (elapsedTime: number) => {
    // Convert real-time seconds to rotation.
    const rotation = this.getRotation(elapsedTime);
    const orbitRotation = this.getOrbitRotation(elapsedTime);
    const orbit = orbitRotation + this.rng;

    // Circular rotation around orbit with y-axis offset.
    this.mesh.position.x = Math.sin(orbit) * this.distance;
    this.mesh.position.y = this.height; // Apply y-axis offset
    this.mesh.position.z = Math.cos(orbit) * this.distance;

    if (this.type === "ring") {
      this.mesh.rotation.z = rotation;
    } else {
      this.mesh.rotation.y = rotation;
    }
  };

  /**
   * @returns the minimum orbital control camera distance allowed.
   */
  getMinDistance = (): number => {
    return this.radius * 3.5;
  };
}
