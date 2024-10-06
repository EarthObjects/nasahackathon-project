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
    speed: 0.125,
    zangle: 0,
    yangle: 0,
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
            width: 800,
            height: 400,
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
        const [solarSystem, planetNames] = createSpaceObjects(scene);
        solarSystem["Sun"].mesh.add(camera);

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

            camera.copy(fakeCamera);
            controls.update();

            const currentBody = solarSystem[options.focus];
            currentBody.labels.update(fakeCamera);

            bloomComposer.render();
            labelRenderer.render(scene, camera);

            requestAnimationFrame(tick);
        };

        tick();

        const buttons = document.querySelectorAll(".switch-camera");
        buttons.forEach(function(button) {
            button.addEventListener("click", function() {
                console.log("Here");
                const newFocus = this.getAttribute('object-name');
                if (newFocus && planetNames.includes(newFocus)) {
                    changeFocus(options.focus, newFocus);

                    options.focus = newFocus;
                }
            });
        });

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
    }, [theme]);

    return (
        <div>
            <canvas id="test" ref={canvasRef} className="webgl"></canvas>
        </div>
    );
};

export default SpaceObjects;
