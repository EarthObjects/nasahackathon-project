// camera.js
import * as THREE from 'three';

export class CameraManager {
  constructor(container, fakeCamera, controls, overviewTarget) {
    this.container = container;
    this.fakeCamera = fakeCamera;
    this.controls = controls;
    this.overviewTarget = overviewTarget || new THREE.Vector3(0, 0, 0); // Default to origin
    this.currentCamera = 'overview'; // Start in overview mode
    this.offset = new THREE.Vector3(0, 5, -10); // Offset for third-person view

    // Increase the far clipping plane to accommodate larger view distances
    const farClippingPlane = 1000000;

    this.cameras = {
      firstPerson: new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.001,
        farClippingPlane
      ),
      thirdPerson: new THREE.PerspectiveCamera(
        10,
        container.clientWidth / container.clientHeight,
        0.0001,
        farClippingPlane
      ),
      overview: this.fakeCamera, // Use the fakeCamera with OrbitControls
    };

    // Set initial camera positions
    this.cameras.firstPerson.position.set(0, 0, 0);
    this.cameras.thirdPerson.position.set(0, 0, 0);
    // The overview camera's position is managed by OrbitControls

    // Set up the overview camera
    this.setupOverviewCamera();
  }

  setupOverviewCamera() {
    // Specify the desired distance from the overview target (Sun)
    const overviewDistance = 20; // Adjust this value as needed

    // Position the overview camera at the specified distance from the target
    const direction = new THREE.Vector3(0, 1, 1).normalize(); // Adjust the direction vector as needed
    const cameraPosition = this.overviewTarget.clone().add(direction.multiplyScalar(overviewDistance));
    this.fakeCamera.position.copy(cameraPosition);

    // Make the camera look at the target
    this.fakeCamera.lookAt(this.overviewTarget);

    // Update OrbitControls target
    this.controls.target.copy(this.overviewTarget);

    // Optionally, set the min and max distances for OrbitControls zoom
    this.controls.minDistance = 0.00001;
    this.controls.maxDistance = overviewDistance * 10; // Allow zooming out further if needed
  }

  getCurrentCamera() {
    return this.cameras[this.currentCamera];
  }

  toggleFirstPerson() {
    if (this.currentCamera === 'firstPerson') {
      this.currentCamera = 'thirdPerson';
    } else if (this.currentCamera === 'thirdPerson') {
      this.currentCamera = 'firstPerson';
    } else if (this.currentCamera === 'overview') {
      // Switch to first-person if currently in overview mode
      this.currentCamera = 'firstPerson';
    }
  }

  setOverview() {
    this.currentCamera = 'overview';
  }

  updateCamera(ship) {
    const camera = this.getCurrentCamera();

    if (this.currentCamera === 'firstPerson') {
      // Position the camera at the ship's position and match its orientation
      camera.position.copy(ship.position);
      camera.quaternion.copy(ship.quaternion);
    } else if (this.currentCamera === 'thirdPerson') {
      // Position the camera behind the ship
      const offset = this.offset.clone().applyQuaternion(ship.quaternion);
      camera.position.copy(ship.position).add(offset);
      camera.lookAt(ship.position);
    } else if (this.currentCamera === 'overview') {
      // In overview mode, the camera is controlled by OrbitControls
      // No need to update position or orientation here
    }

    // Update the projection matrix in case of any changes
    camera.updateProjectionMatrix();
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    for (let key in this.cameras) {
      const camera = this.cameras[key];
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }
}
