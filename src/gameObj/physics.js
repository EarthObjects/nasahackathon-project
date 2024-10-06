// physics.js
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

const G = 0.001; // Gravitational constant (adjust as needed)

function calculateGravityForce(body1, body2) {
  const distanceVector = new CANNON.Vec3();
  body2.position.vsub(body1.position, distanceVector);
  const distance = distanceVector.length();
  const forceMagnitude = (G * body1.mass * body2.mass) / (distance * distance);

  // Normalize to get direction
  distanceVector.normalize();

  // Calculate force vector
  const force = distanceVector.scale(forceMagnitude);

  return force;
}

export class PhysicsManager {
  constructor(ship, celestialBodies) {
    // Initialize the physics world
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, 0); // Gravity will be applied manually

    // Ship's physics body
    const radius = 0.5; // Match the ship's geometry
    const length = 2;   // Match the ship's geometry
    const segments = 16;

    this.shipBody = new CANNON.Body({
      mass: ship.mass,
      position: new CANNON.Vec3(ship.position.x, ship.position.y, ship.position.z),
      angularDamping: 0.5,
      linearDamping: 0.1,
    });

    // Create compound shape for the ship (capsule)
    const sphereShapeTop = new CANNON.Sphere(radius);
    const sphereShapeBottom = new CANNON.Sphere(radius);
    const cylinderShape = new CANNON.Cylinder(radius, radius, length, segments);

    // Rotate cylinder to align along the ship's axis (assuming Y-axis)
    const q = new CANNON.Quaternion();
    q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);

    // Add shapes to the body to form a capsule
    this.shipBody.addShape(cylinderShape, new CANNON.Vec3(0, 0, 0), q);
    this.shipBody.addShape(sphereShapeTop, new CANNON.Vec3(0, length / 2, 0));
    this.shipBody.addShape(sphereShapeBottom, new CANNON.Vec3(0, -length / 2, 0));

    // Enable CCD for the ship
    this.shipBody.collisionResponse = true;
    this.shipBody.collisionFilterGroup = 1;
    this.shipBody.collisionFilterMask = 1;
    this.shipBody.ccdSpeedThreshold = 1; // Activate CCD if speed > 1
    this.shipBody.ccdIterations = 10;    // Number of CCD iterations

    this.world.addBody(this.shipBody);

    // Map Three.js meshes to Cannon.js bodies for celestial bodies
    this.celestialBodies = celestialBodies;
    this.planetBodies = celestialBodies.map((body) => {
      const radius = body.geometry.boundingSphere
        ? body.geometry.boundingSphere.radius
        : body.geometry.parameters.radius || 1;

      const position = new THREE.Vector3();
      body.getWorldPosition(position);

      const planetBody = new CANNON.Body({
        mass: 0, // Celestial bodies are static
        shape: new CANNON.Sphere(radius),
        position: new CANNON.Vec3(position.x, position.y, position.z),
        type: CANNON.Body.STATIC,
      });

      this.world.addBody(planetBody);
      return { mesh: body, body: planetBody };
    });

    // Attach the Three.js mesh to the Cannon.js body
    this.shipBody.threeMesh = ship;
  }

  update(deltaTime) {
    // Reset forces on the ship
    this.shipBody.force.set(0, 0, 0);
    this.shipBody.torque.set(0, 0, 0);

    // Apply gravitational forces from celestial bodies to the ship
    this.planetBodies.forEach(({ body: planetBody }) => {
      const gravityForce = calculateGravityForce(this.shipBody, planetBody);
      this.shipBody.applyForce(gravityForce, this.shipBody.position);
    });

    // Apply thrust force from controls
    if (this.shipBody.thrustForce) {
      this.shipBody.applyLocalForce(this.shipBody.thrustForce, new CANNON.Vec3(0, 0, 0));
      this.shipBody.thrustForce = null;
    }

    // Apply rotation torque from controls
    if (this.shipBody.rotationTorque) {
      this.shipBody.torque.copy(this.shipBody.rotationTorque);
      this.shipBody.rotationTorque = null;
    }

    // Fixed time step
    const fixedTimeStep = 1 / 60; // 60 FPS
    const maxSubSteps = 3;

    // Step the physics simulation
    this.world.step(fixedTimeStep, deltaTime, maxSubSteps);

    // Update the ship's mesh position and rotation
    this.updateShipMesh();
  }

  updateShipMesh() {
    const { shipBody } = this;
    shipBody.threeMesh.position.copy(shipBody.position);
    shipBody.threeMesh.quaternion.copy(shipBody.quaternion);
  }
}
