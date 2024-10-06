// physics.js
import * as CANNON from 'cannon-es';

const G = 6.67430e-3; // Scaled gravitational constant for simulation

function calculateGravityForce(body1, body2) {
  const distanceVector = new CANNON.Vec3();
  body2.position.vsub(body1.position, distanceVector);
  const distance = distanceVector.length();
  const forceMagnitude = (G * body1.mass * body2.mass) / (distance * distance);

  // Normalize to get direction
  distanceVector.normalize(); // Modifies distanceVector in place

  // Calculate force vector
  const force = distanceVector.scale(forceMagnitude); // Modifies distanceVector in place

  return force;
}

export class PhysicsManager {
  constructor(ship, celestialBodies) {
    // Initialize the physics world
    this.world = new CANNON.World();
    this.world.gravity.set(0, 0, 0); // Gravity will be applied manually

    // Configure solver for better collision handling
    this.world.solver.iterations = 20;
    this.world.solver.tolerance = 0.001;
    this.world.solver.relaxation = 4;

    // Ship's physics body
    const radius = 0.5; // Same as in ship.js
    const length = 2;   // Same as in ship.js
    const segments = 16;

    this.shipBody = new CANNON.Body({
      mass: ship.mass,
      position: new CANNON.Vec3(ship.position.x, ship.position.y, ship.position.z),
      quaternion: new CANNON.Quaternion(
        ship.quaternion.x,
        ship.quaternion.y,
        ship.quaternion.z,
        ship.quaternion.w
      ),
      angularDamping: 0.5, // Increased angular damping
      linearDamping: 0.1,  // Adjust as needed
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

    // Map Three.js meshes to Cannon.js bodies for planets
    this.celestialBodies = celestialBodies;
    this.planetBodies = celestialBodies.map((body) => {
      const radius = body.geometry.parameters.radius;

      const planetBody = new CANNON.Body({
        mass: body.mass,
        shape: new CANNON.Sphere(radius),
        position: new CANNON.Vec3(body.position.x, body.position.y, body.position.z),
        collisionResponse: true,
      });
      this.world.addBody(planetBody);
      return { mesh: body, body: planetBody };
    });

    // Materials and contact materials for collision properties
    const shipMaterial = new CANNON.Material('shipMaterial');
    const planetMaterial = new CANNON.Material('planetMaterial');
    const contactMaterial = new CANNON.ContactMaterial(shipMaterial, planetMaterial, {
      friction: 0.5, // Reduced friction
      restitution: 0.2,
    });
    this.world.addContactMaterial(contactMaterial);
    this.shipBody.material = shipMaterial;
    this.planetBodies.forEach(({ body }) => {
      body.material = planetMaterial;
    });

    // Attach Three.js mesh to Cannon.js body
    this.shipBody.threeMesh = ship;

    // Initialize fuel
    this.fuel = 100;
  }

  getFuel() {
    return this.fuel;
  }

  update(deltaTime) {
    // Reset forces on the ship
    this.shipBody.force.set(0, 0, 0);
    this.shipBody.torque.set(0, 0, 0);

    // Apply gravitational forces from planets to the ship
    this.planetBodies.forEach(({ body: planetBody }) => {
      const gravityForce = calculateGravityForce(this.shipBody, planetBody);
      this.shipBody.applyForce(gravityForce, this.shipBody.position);
    });

    // Apply thrust force from controls
    if (this.shipBody.thrustForce && this.fuel > 0) {
      this.shipBody.applyLocalForce(this.shipBody.thrustForce, new CANNON.Vec3(0, 0, 0));
      // Reduce fuel based on thrust
      this.fuel -= this.shipBody.thrustForce.length() * 0.001;
      // Reset thrustForce after applying
      this.shipBody.thrustForce = null;
    }

    // Apply rotation torque from controls
    if (this.shipBody.rotationTorque) {
      this.shipBody.torque.copy(this.shipBody.rotationTorque);
      // Reset rotationTorque after applying
      this.shipBody.rotationTorque = null;
    }

    // Fixed time step
    const fixedTimeStep = 1 / 60; // 60 FPS
    const maxSubSteps = 3;

    // Step the physics simulation
    this.world.step(fixedTimeStep, deltaTime, maxSubSteps);

    // Update ship's position and rotation in Three.js
    this.updateShipMesh();

    // Update planets' positions if they are moving (e.g., in orbit)
    this.updatePlanets();
  }

  updateShipMesh() {
    // Update the Three.js mesh position and rotation from Cannon.js body
    const { shipBody } = this;
    shipBody.threeMesh.position.copy(shipBody.position);
    shipBody.threeMesh.quaternion.copy(shipBody.quaternion);
  }

  updatePlanets() {
    // Update planet positions and sync with their Cannon.js bodies
    this.planetBodies.forEach(({ mesh, body }) => {
      if (mesh.orbit) {
        mesh.orbit.angle += mesh.orbit.speed;
        mesh.position.x = mesh.orbit.center.x + mesh.orbit.radius * Math.cos(mesh.orbit.angle);
        mesh.position.z = mesh.orbit.center.z + mesh.orbit.radius * Math.sin(mesh.orbit.angle);
        mesh.position.y = mesh.orbit.center.y;

        // Update Cannon.js body position
        body.position.copy(mesh.position);
      }
    });
  }
}
