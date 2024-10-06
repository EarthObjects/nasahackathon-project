// camera.js
import * as THREE from 'three';

export class CameraManager {
  constructor(container, targetPosition) {
    this.container = container;
    this.targetPosition = targetPosition || new THREE.Vector3(0, 0, 0);
    this.cameras = {
      firstPerson: new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 100000),
      thirdPerson: new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100000),
      overview: new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 50000000),
    };
    this.currentCamera = 'thirdPerson';
    this.offset = new THREE.Vector3(0, 5, -10); // Offset for third-person view
  }

  getCurrentCamera() {
    return this.cameras[this.currentCamera];
  }

  toggleFirstPerson() {
    if (this.currentCamera === 'firstPerson') {
      this.currentCamera = 'thirdPerson';
    } else {
      this.currentCamera = 'firstPerson';
    }
  }

  setOverview() {
    this.currentCamera = 'overview';
  }

  updateCamera(ship) {
    const camera = this.getCurrentCamera();

    if (this.currentCamera === 'firstPerson') {
      // Position the camera at the ship's position
      camera.position.copy(ship.position);
      camera.quaternion.copy(ship.quaternion);
    } else if (this.currentCamera === 'thirdPerson') {
      // Position the camera behind the ship
      const offset = this.offset.clone().applyQuaternion(ship.quaternion);
      camera.position.copy(ship.position).add(offset);
      camera.lookAt(ship.position);
    } else if (this.currentCamera === 'overview') {
      // Position the camera to look at the Sun
      const distance = 500; // Adjust as needed
      camera.position.copy(this.targetPosition).add(new THREE.Vector3(0, distance, 0));
      camera.lookAt(this.targetPosition);
    }

    camera.updateProjectionMatrix();
  }

  onWindowResize() {
    for (let key in this.cameras) {
      const camera = this.cameras[key];
      camera.aspect = this.container.clientWidth / this.container.clientHeight;
      camera.updateProjectionMatrix();
    }
  }
}
