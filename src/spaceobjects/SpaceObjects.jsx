// SpaceObjects.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { createLights } from "./setup/lights";
import { createSpaceObjects } from "./setup/solar-system";
import { LAYERS } from "./constants";
import { createDarkEnvironmentMap } from "./setup/environment-dark";
import { createClearEnvironmentMap } from "./setup/environment-clear";
import { createShip } from "../gameObj/ship";
import { PhysicsManager } from "../gameObj/physics";
import { initializeControls } from "../gameObj/controls";
import { CameraManager } from "../gameObj/camera";

export const options = {
    showPaths: true,
    showMoons: true,
    focus: "Sun",
    clock: true,
    speed: 0.2,
    zangle: 0,
    yangle: 0,
};

const createComets = (scene, count) => {
	const comets = [];
	for (let i = 0; i < count; i++) {
		const geometry = new THREE.SphereGeometry(0.5, 16, 16); // Increased size for visibility
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
		const comet = new THREE.Mesh(geometry, material);

		const radius = Math.random() * 400 + 100;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);

		comet.position.x = radius * Math.sin(phi) * Math.cos(theta);
		comet.position.y = radius * Math.sin(phi) * Math.sin(theta);
		comet.position.z = radius * Math.cos(phi);

		// Random velocity
		comet.velocity = new THREE.Vector3(
			(Math.random() - 0.5) * 2,
			(Math.random() - 0.5) * 2,
			(Math.random() - 0.5) * 2
		);

		scene.add(comet);
		comets.push(comet);
	}
	return comets;
};

const createMeteors = (scene, count) => {
	const meteors = [];
	for (let i = 0; i < count; i++) {
		const meteorGeometry = new THREE.SphereGeometry(0.2, 8, 8);
		const meteorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
		const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);

		const tailGeometry = new THREE.BufferGeometry();
		const tailMaterial = new THREE.LineBasicMaterial({
			color: 0xffffff,
			opacity: 0.7,
			transparent: true,
		});
		const tailPoints = [
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(0, 0, -0.2),
			new THREE.Vector3(0, 0, -0.4),
			new THREE.Vector3(0, 0, -0.6),
		];
		tailGeometry.setFromPoints(tailPoints);
		const tail = new THREE.Line(tailGeometry, tailMaterial);

		meteor.add(tail);

		const radius = Math.random() * 400 + 100;
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos(2 * Math.random() - 1);

		meteor.position.x = radius * Math.sin(phi) * Math.cos(theta);
		meteor.position.y = radius * Math.sin(phi) * Math.sin(theta);
		meteor.position.z = radius * Math.cos(phi);

		meteor.velocity = new THREE.Vector3(
			(Math.random() - 0.5) * 1,
			(Math.random() - 0.5) * 1,
			(Math.random() - 0.5) * 1
		);

		scene.add(meteor);
		meteors.push(meteor);
	}
	return meteors;
};

const createStarField = (scene, count) => {
	const particles = new THREE.BufferGeometry();
	const positions = new Float32Array(count * 3);
	const radius = 5000;

	for (let i = 0; i < count * 3; i += 3) {
		const theta = Math.random() * 2 * Math.PI;
		const phi = Math.acos(2 * Math.random() - 1);
		const r = radius * Math.cbrt(Math.random());

		positions[i] = r * Math.sin(phi) * Math.cos(theta);
		positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
		positions[i + 2] = r * Math.cos(phi);
	}

	particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

	const material = new THREE.PointsMaterial({
		color: 0xffffff,
		size: 1,
		transparent: true,
		opacity: 0.8,
		sizeAttenuation: true,
	});

	const starField = new THREE.Points(particles, material);
	scene.add(starField);
	return starField;
};

const SpaceObjects = ({ theme }) => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const scene = new THREE.Scene();
		if (theme?.palette?.mode === "dark") {
			console.log("dark mode");
			scene.background = createDarkEnvironmentMap("./textures/environment");
		} else {
			console.log("light mode");
			scene.background = createClearEnvironmentMap("./textures/environment");
		}

		// Lights setup
		const [ambientLight, pointLight] = createLights();
		scene.add(ambientLight, pointLight);

        // Camera setup
        const sizes = {
            width: 760,
            height: 500,
        };

		const aspect = sizes.width / sizes.height;
		const camera = new THREE.PerspectiveCamera(70, aspect, 0.1, 1000000);

		// Renderer setup
		const renderer = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
			antialias: true,
		});
		renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
		renderer.setSize(sizes.width, sizes.height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// Solar system and space object setup
		const [solarSystem, planetNames] = createSpaceObjects(scene);
		const comets = createComets(scene, 10); // Create 10 comets
		const meteors = createMeteors(scene, 10); // Create 10 meteors
		const starField = createStarField(scene, 5000); // Create 5000 star particles

		// Camera Manager and Controls
		const fakeCamera = new THREE.PerspectiveCamera(
			70,
			sizes.width / sizes.height,
			0.1,
			1000000
		);
		fakeCamera.position.set(0, 1000, 1000);
		fakeCamera.lookAt(new THREE.Vector3(0, 0, 0));
		const controls = new OrbitControls(fakeCamera, canvasRef.current);
		controls.target.set(0, 0, 0);
		controls.enableDamping = true;
		controls.enablePan = false;
		controls.minDistance = 10;
		controls.maxDistance = 1000000; // Adjust as needed

		// Initialize Camera Manager
		const cameraManager = new CameraManager(
			canvasRef.current,
			fakeCamera,
			controls
		);
		let currentCamera = cameraManager.getCurrentCamera();

		// Create Ship
		const ship = createShip();
		scene.add(ship);

		// Position the ship near Earth or any other celestial body
		const earth = solarSystem["Earth"].mesh;
		const earthRadius = earth.geometry.parameters.radius || 1;

		const earthPosition = new THREE.Vector3();
		earth.getWorldPosition(earthPosition);

		ship.position
			.copy(earthPosition)
			.add(new THREE.Vector3(earthRadius + 10, 0, 0));

		// Initialize Physics Manager
		const physicsManager = new PhysicsManager(
			ship,
			Object.values(solarSystem).map((obj) => obj.mesh)
		);

		// Controls
		const { cleanup: controlsCleanup } = initializeControls(
			physicsManager.shipBody,
			cameraManager
		);

		const labelRenderer = new CSS2DRenderer();
		labelRenderer.setSize(sizes.width, sizes.height);
		labelRenderer.domElement.style.position = "absolute";
		labelRenderer.domElement.style.top = "0";
		labelRenderer.domElement.style.pointerEvents = "none";
		canvasRef.current.parentNode.appendChild(labelRenderer.domElement);

		// Effect composer for bloom effect
		const renderScene = new RenderPass(scene, camera);
		const bloomPass = new UnrealBloomPass(
			new THREE.Vector2(sizes.width, sizes.height),
			0.75,
			0,
			1
		);
		const bloomComposer = new EffectComposer(renderer);
		bloomComposer.setSize(sizes.width, sizes.height);
		bloomComposer.renderToScreen = true;
		bloomComposer.addPass(renderScene);
		bloomComposer.addPass(bloomPass);

    const renderScene2 = new RenderPass(scene, camera);
        const bloomPass2 = new UnrealBloomPass(
            new THREE.Vector2(sizes.width, sizes.height),
            0.5, // Bloom strength
            0.4,  // Bloom radius
            0.2  // Bloom threshold
        );
        const bloomComposer2 = new EffectComposer(renderer);
        bloomComposer2.setSize(sizes.width, sizes.height);
        bloomComposer2.renderToScreen = true;
        bloomComposer2.addPass(renderScene2);
        bloomComposer2.addPass(bloomPass2);

    const clock = new THREE.Clock();
    let elapsedTime = 0;
    fakeCamera.layers.enable(LAYERS.POILabel);

		const tick = () => {
			const deltaTime = clock.getDelta();
			elapsedTime += deltaTime * options.speed;

			// Update solar system objects
			for (const object of Object.values(solarSystem)) {
				object.tick(elapsedTime);
			}

			// Update comet positions
			for (const comet of comets) {
				comet.position.add(comet.velocity);

				// If comet goes too far, reset its position
				if (comet.position.length() > 5000) {
					comet.position.setLength(Math.random() * 400 + 100);
				}
			}

			// Update meteor positions
			for (const meteor of meteors) {
				meteor.position.add(meteor.velocity);

				// Update tail position
				const tailLength = 0.6;
				const tailSegments = 4;
				const tailPoints = [];
				for (let j = 0; j <= tailSegments; j++) {
					const factor = j / tailSegments;
					tailPoints.push(
						new THREE.Vector3(
							-meteor.velocity.x * factor * tailLength,
							-meteor.velocity.y * factor * tailLength,
							-meteor.velocity.z * factor * tailLength
						)
					);
				}
				meteor.children[0].geometry.setFromPoints(tailPoints);

				// If meteor goes too far, reset its position
				if (meteor.position.length() > 5000) {
					meteor.position.setLength(Math.random() * 400 + 100);
				}
			}

			// Update physics
			physicsManager.update(deltaTime);

			// Update camera based on camera mode
			if (cameraManager.currentCamera === "overview") {
				controls.update();
				currentCamera = cameraManager.getCurrentCamera();
			} else {
				cameraManager.updateCamera(ship);
				currentCamera = cameraManager.getCurrentCamera();
			}

			// Update renderPass camera
			renderScene.camera = currentCamera;

      bloomComposer.render();
      bloomComposer2.render();
      labelRenderer.render(scene, camera);

			requestAnimationFrame(tick);
		};

		tick();

		// Handle window resize
		const handleResize = () => {
			sizes.width = window.innerWidth;
			sizes.height = window.innerHeight;

			renderer.setSize(sizes.width, sizes.height);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			bloomComposer.setSize(sizes.width, sizes.height);
			labelRenderer.setSize(sizes.width, sizes.height);

			cameraManager.onWindowResize();
		};

		window.addEventListener("resize", handleResize);

		// Cleanup on unmount
		return () => {
			window.removeEventListener("resize", handleResize);
			controls.dispose();
			controlsCleanup();
		};
	}, [theme]);

	return (
		<div>
			<canvas id="test" ref={canvasRef} className="webgl"></canvas>
		</div>
	);
};

export default SpaceObjects;
