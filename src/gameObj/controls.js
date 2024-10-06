// controls.js
import * as CANNON from 'cannon-es';

export function initializeControls(shipBody, cameraManager) {
  const thrustMagnitude = 1;
  const rotationSpeed = 0.5;

  const keyState = {};

  const keyDownHandler = (event) => {
    keyState[event.key.toLowerCase()] = true;

    // Camera toggle keys
    if (event.key.toLowerCase() === 'v') {
      cameraManager.toggleFirstPerson();
    }
    if (event.key.toLowerCase() === 'm') {
      cameraManager.setOverview();
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
      thrustForce.z -= thrustMagnitude;
    }
    if (keyState['s']) {
      thrustForce.z += thrustMagnitude;
    }
    if (keyState['a']) {
      thrustForce.x -= thrustMagnitude;
    }
    if (keyState['d']) {
      thrustForce.x += thrustMagnitude;
    }
    if (keyState[' ']) {
      thrustForce.y += thrustMagnitude;
    }
    if (keyState['shift']) {
      thrustForce.y -= thrustMagnitude;
    }

    // Rotation Controls
    if (keyState['q']) {
      rotationTorque.z += rotationSpeed;
    }
    if (keyState['e']) {
      rotationTorque.z -= rotationSpeed;
    }
    if (keyState['arrowleft']) {
      rotationTorque.y += rotationSpeed;
    }
    if (keyState['arrowright']) {
      rotationTorque.y -= rotationSpeed;
    }
    if (keyState['arrowup']) {
      rotationTorque.x += rotationSpeed;
    }
    if (keyState['arrowdown']) {
      rotationTorque.x -= rotationSpeed;
    }

    // Apply thrust and torque to the ship's physics body
    shipBody.thrustForce = thrustForce.length() > 0 ? thrustForce : null;
    shipBody.rotationTorque = rotationTorque.length() > 0 ? rotationTorque : null;
  }

  // Apply controls each frame
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
