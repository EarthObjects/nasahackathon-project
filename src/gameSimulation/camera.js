import * as THREE from 'three';

export class CameraManager {
  constructor(container) {
    this.container = container;
    this.cameras = {
      firstPerson: new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 1000),
      thirdPerson: new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000),
      overview: new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 5000),
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
      camera.rotation.copy(ship.rotation);
    } else if (this.currentCamera === 'thirdPerson') {
      // Position the camera behind the ship
      const offset = this.offset.clone().applyQuaternion(ship.quaternion);
      camera.position.copy(ship.position).add(offset);
      camera.lookAt(ship.position);
    } else if (this.currentCamera === 'overview') {
      // Position the camera above the scene
      camera.position.set(0, 200, 0);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
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
