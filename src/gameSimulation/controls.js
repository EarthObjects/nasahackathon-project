import * as CANNON from 'cannon-es';

export function initializeControls(cameraManager, rendererDomElement, ship, physicsManager) {
  const thrustMagnitude = 50;
  const rotationSpeed = 2;

  const keyState = {};

  const keyDownHandler = (event) => {
    keyState[event.key.toLowerCase()] = true;

    switch (event.key.toLowerCase()) {
      case 'v':
        cameraManager.toggleFirstPerson();
        break;
      case 'm':
        cameraManager.setOverview();
        break;
    }
  };

  const keyUpHandler = (event) => {
    keyState[event.key.toLowerCase()] = false;
  };

  window.addEventListener('keydown', keyDownHandler);
  window.addEventListener('keyup', keyUpHandler);

  function applyControls() {
    const thrustForce = new CANNON.Vec3();
    const rotationTorque = new CANNON.Vec3();

    // Thrust Controls
    if (keyState['w']) {
      thrustForce.z += thrustMagnitude;
    }
    if (keyState['s']) {
      thrustForce.z -= thrustMagnitude;
    }
    if (keyState['a']) {
      thrustForce.x += thrustMagnitude;
    }
    if (keyState['d']) {
      thrustForce.x -= thrustMagnitude;
    }
    if (keyState[' ']) {
      thrustForce.y += thrustMagnitude;
    }
    if (keyState['shift']) {
      thrustForce.y -= thrustMagnitude;
    }

    // Rotation Controls
    if (keyState['q']) {
      rotationTorque.y += rotationSpeed;
    }
    if (keyState['e']) {
      rotationTorque.y -= rotationSpeed;
    }
    if (keyState['z']) {
      rotationTorque.x += rotationSpeed;
    }
    if (keyState['x']) {
      rotationTorque.x -= rotationSpeed;
    }

    // Apply thrust and torque to the ship's physics body
    const shipBody = physicsManager.shipBody;
    if (physicsManager.fuel > 0) {
      shipBody.thrustForce = thrustForce.length() > 0 ? thrustForce : null;
      shipBody.rotationTorque = rotationTorque.length() > 0 ? rotationTorque : null;
      physicsManager.fuel -= (thrustForce.length() + rotationTorque.length()) * 0.001; // Decrease fuel based on thrust and rotation
    } else {
      shipBody.thrustForce = null;
      shipBody.rotationTorque = null;
    }
  }

  // We need to apply controls each frame
  function update() {
    applyControls();
    requestAnimationFrame(update);
  }
  update();

  const cleanup = () => {
    window.removeEventListener('keydown', keyDownHandler);
    window.removeEventListener('keyup', keyUpHandler);
  };

  return {
    cleanup,
  };
}