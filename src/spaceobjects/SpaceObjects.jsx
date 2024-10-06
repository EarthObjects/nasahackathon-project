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
        const geometry = new THREE.SphereGeometry(0.05, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const comet = new THREE.Mesh(geometry, material);

        const radius = Math.random() * 40 + 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        comet.position.x = radius * Math.sin(phi) * Math.cos(theta);
        comet.position.y = radius * Math.sin(phi) * Math.sin(theta);
        comet.position.z = radius * Math.cos(phi);

        // Random velocity
        comet.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4
        );

        scene.add(comet);
        comets.push(comet);
    }
    return comets;
};

const createMeteors = (scene, count) => {
    const meteors = [];
    for (let i = 0; i < count; i++) {
        const meteorGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const meteorMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const meteor = new THREE.Mesh(meteorGeometry, meteorMaterial);

        const tailGeometry = new THREE.BufferGeometry();
        const tailMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, opacity: 0.7, transparent: true });
        const tailPoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -0.2),
            new THREE.Vector3(0, 0, -0.4),
            new THREE.Vector3(0, 0, -0.6)
        ];
        tailGeometry.setFromPoints(tailPoints);
        const tail = new THREE.Line(tailGeometry, tailMaterial);

        meteor.add(tail);

        const radius = Math.random() * 40 + 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        meteor.position.x = radius * Math.sin(phi) * Math.cos(theta);
        meteor.position.y = radius * Math.sin(phi) * Math.sin(theta);
        meteor.position.z = radius * Math.cos(phi);

        meteor.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        );

        scene.add(meteor);
        meteors.push(meteor);
    }
    return meteors;
};

const createStarField = (scene, count) => {
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 1;
        positions[i + 1] = (Math.random() - 0.5) * 1;
        positions[i + 2] = (Math.random() - 0.5) * 1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.1,
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
        if (theme?.palette?.mode === 'dark') {
            console.log('dark mode');
            scene.background = createDarkEnvironmentMap("./textures/environment");
        } else {
            console.log('light mode');
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
        const camera = new THREE.PerspectiveCamera(70, aspect, 0.1, 1000);
        camera.position.set(0, 20, 0);

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

        // Solar system setup
        // Solar system and space object setup
        const [solarSystem, planetNames] = createSpaceObjects(scene);
        const comets = createComets(scene, 10); // Create 10 comets
        const meteors = createMeteors(scene, 10); // Create 20 meteors
        const starField = createStarField(scene, 5000); // Create 5000 star particles
        const fakeCamera = camera.clone();
        const controls = new OrbitControls(fakeCamera, canvasRef.current);
        controls.target = solarSystem["Sun"].mesh.position;
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = solarSystem["Sun"].getMinDistance();
        controls.maxDistance = 50;

        const changeFocus = (oldFocus, newFocus) => {
            solarSystem[oldFocus].mesh.remove(camera);
            solarSystem[newFocus].mesh.add(camera);
            const minDistance = solarSystem[newFocus].getMinDistance();
            controls.minDistance = minDistance;
            fakeCamera.position.set(minDistance, minDistance / 3, 0);
            solarSystem[oldFocus].labels.hidePOI();
            solarSystem[newFocus].labels.showPOI();
        };

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(sizes.width, sizes.height);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        labelRenderer.domElement.style.pointerEvents = 'none';
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

        // Animation loop
        const clock = new THREE.Clock();
        let elapsedTime = 0;
        fakeCamera.layers.enable(LAYERS.POILabel);

        const tick = () => {
            elapsedTime += clock.getDelta() * options.speed;

            for (const object of Object.values(solarSystem)) {
                object.tick(elapsedTime);
            }

            // Update comet positions
            for (const comet of comets) {
                comet.position.add(comet.velocity);

                // If comet goes too far, reset its position
                if (comet.position.length() > 50) {
                    comet.position.setLength(Math.random() * 40 + 10);
                }
            }

            // Update meteor positions
            for (const meteor of meteors) {
                meteor.position.add(meteor.velocity);

                // Update tail position
                const tailPoints = meteor.children[0].geometry.attributes.position.array;
                for (let i = 3; i < tailPoints.length; i += 3) {
                    tailPoints[i] = -meteor.velocity.x * (i / 3) * 0.8;
                    tailPoints[i + 1] = -meteor.velocity.y * (i / 3) * 0.8;
                    tailPoints[i + 2] = -meteor.velocity.z * (i / 3) * 0.8;
                }
                meteor.children[0].geometry.attributes.position.needsUpdate = true;

                // If meteor goes too far, reset its position
                if (meteor.position.length() > 50) {
                    meteor.position.setLength(Math.random() * 40 + 10);
                }
            }

            camera.copy(fakeCamera);
            controls.update();

            const currentBody = solarSystem[options.focus];
            currentBody.labels.update(fakeCamera);

            bloomComposer.render();
            labelRenderer.render(scene, camera);

            requestAnimationFrame(tick);
        };

        tick();

        // Listen for custom event to switch camera
        const handleSwitchCamera = (event) => {
            const newFocus = event.detail.planetName;
            if (newFocus && planetNames.includes(newFocus)) {
                changeFocus(options.focus, newFocus);
                options.focus = newFocus;
            }
        };

        window.addEventListener('switchCamera', handleSwitchCamera);

        // Handle window resize
        const handleResize = () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            bloomComposer.setSize(sizes.width, sizes.height);
            labelRenderer.setSize(sizes.width, sizes.height);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup event listeners on unmount
        return () => {
            window.removeEventListener('switchCamera', handleSwitchCamera);
            window.removeEventListener("resize", handleResize);
        };
    }, [theme]);

    return (
        <div>
            <canvas id="test" ref={canvasRef} className="webgl"></canvas>
        </div>
    );
};

export default SpaceObjects;
