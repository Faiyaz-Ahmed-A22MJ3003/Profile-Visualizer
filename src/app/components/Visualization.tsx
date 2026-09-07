"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { Easing, Group, Tween } from "@tweenjs/tween.js";
import { Profile } from "./fetchSheetsData";

interface VisualizationProps {
    profiles: Profile[];
}

type Layout = "table" | "sphere" | "helix" | "grid";

const TableIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" />
    </svg>
);

const SphereIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
    </svg>
);

const HelixIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4c4 4 4 12 8 12s4-8 8-12" />
        <path d="M4 20c4-4 4-12 8-12s4 8 8 12" />
        <path d="M6 7h12" /><path d="M8 12h8" /><path d="M6 17h12" />
    </svg>
);

const GridIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
);

const ResetIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);

export default function Visualization({ profiles }: VisualizationProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const transformRef = useRef<((layout: Layout) => void) | null>(null);
    const resetViewRef = useRef<(() => void) | null>(null);
    const setRotationRef = useRef<((x: number, y: number, z: number) => void) | null>(null);
    const updateGridLayerRef = useRef<((layer: number | "all") => void) | null>(null);

    const [activeLayout, setActiveLayout] = useState<Layout>("table");
    const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
    const [showControls, setShowControls] = useState(false);
    const [selectedGridLayer, setSelectedGridLayer] = useState<number | "all">("all");

    const rotationRef = useRef({ x: 0, y: 0, z: 0 });
    const activeLayoutRef = useRef<Layout>("table");
    const autoRotateRef = useRef<boolean>(false);

    const maxGridLayers = Math.max(1, Math.ceil(profiles.length / 20));

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.replaceChildren();

        // 1. Scene & Camera Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            1,
            10000
        );

        const defaultCameraPosition = new THREE.Vector3(0, 0, 3000);
        const defaultCameraTarget = new THREE.Vector3(0, 0, 0);
        camera.position.copy(defaultCameraPosition);

        // 2. Visualization Group
        const visualizationGroup = new THREE.Group();
        scene.add(visualizationGroup);

        // 3. Renderer Setup
        const renderer = new CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.top = "0";
        renderer.domElement.style.left = "0";
        container.appendChild(renderer.domElement);

        // 4. Trackball Controls
        const controls = new TrackballControls(camera, renderer.domElement);
        controls.minDistance = 500;
        controls.maxDistance = 6000;
        controls.target.copy(defaultCameraTarget);

        // Stop auto-rotation when user manually interacts
        controls.addEventListener("start", () => {
            autoRotateRef.current = false;
        });

        // 5. Target Collections & Objects
        const objects: CSS3DObject[] = [];
        const tableTargets: THREE.Object3D[] = [];
        const sphereTargets: THREE.Object3D[] = [];
        const helixTargets: THREE.Object3D[] = [];
        const gridTargets: THREE.Object3D[] = [];

        const tweenGroup = new Group();
        const lookAtVector = new THREE.Vector3();

        const getNetWorthColor = (netWorth: number) => {
            if (netWorth < 100000) return "rgba(210, 55, 55, 0.88)";
            if (netWorth <= 200000) return "rgba(225, 145, 45, 0.88)";
            return "rgba(45, 165, 80, 0.88)";
        };

        profiles.forEach((profile, index) => {
            const element = document.createElement("div");
            element.className = "profile-card";
            element.style.width = "120px";
            element.style.height = "200px";
            element.style.backgroundColor = getNetWorthColor(profile.netWorth);
            element.style.color = "#ffffff";
            element.style.textAlign = "center";
            element.style.boxSizing = "border-box";
            element.style.padding = "10px";
            element.style.border = "1px solid rgba(255,255,255,0.35)";
            element.style.borderRadius = "14px";
            element.style.boxShadow = "0 10px 30px rgba(0,0,0,0.28)";
            element.style.fontFamily = "Arial, Helvetica, sans-serif";
            element.style.overflow = "hidden";
            element.style.transition = "opacity 0.5s ease";

            element.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; height: 100%;">
                    <img src="${profile.photo}" draggable="false" style="width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.9); margin-bottom: 7px; flex-shrink: 0;" />
                    <div style="width: 100%; font-size: 13px; font-weight: 700; line-height: 1.2; margin-bottom: 7px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${profile.name}</div>
                    <div style="width: 34px; height: 1px; background: rgba(255,255,255,0.55); margin-bottom: 7px;"></div>
                    <div style="font-size: 10.5px; line-height: 1.55; opacity: 0.95;">
                        <div><strong>Age</strong> ${profile.age}</div>
                        <div><strong>Country</strong> ${profile.country}</div>
                        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><strong>Interest</strong> ${profile.interest}</div>
                        <div style="margin-top: 5px; font-size: 10px; opacity: 0.8;">NET WORTH</div>
                        <div style="font-size: 12px; font-weight: 700;">$${profile.netWorth.toLocaleString()}</div>
                    </div>
                </div>
            `;

            const object = new CSS3DObject(element);

            // Table Target
            const column = index % 20;
            const row = Math.floor(index / 20);
            const tableTarget = new THREE.Object3D();
            tableTarget.position.set(column * 140 - (19 * 140) / 2, -(row * 220) + (9 * 220) / 2, 0);
            tableTargets.push(tableTarget);

            // Sphere Target
            const sphereTarget = new THREE.Object3D();
            const phi = Math.acos(-1 + (2 * index) / profiles.length);
            const theta = Math.sqrt(profiles.length * Math.PI) * phi;
            sphereTarget.position.setFromSphericalCoords(900, phi, theta);
            lookAtVector.copy(sphereTarget.position).multiplyScalar(2);
            sphereTarget.lookAt(lookAtVector);
            sphereTargets.push(sphereTarget);

            // Initial Placement
            object.position.copy(tableTarget.position);
            object.rotation.copy(tableTarget.rotation);

            objects.push(object);
            visualizationGroup.add(object);
        });

        // Helix Targets
        const helixRadius = 700;
        const helixHeight = 2200;
        const helixTurns = 3;

        profiles.forEach((_, index) => {
            const strand = index % 2;
            const strandIndex = Math.floor(index / 2);
            const angle = (strandIndex / 99) * Math.PI * 2 * helixTurns;
            const y = (strandIndex / 99) * helixHeight - helixHeight / 2;
            const theta = angle + (strand === 0 ? 0 : Math.PI);

            const position = new THREE.Vector3(helixRadius * Math.cos(theta), y, helixRadius * Math.sin(theta));
            const tempObject = new THREE.Object3D();
            tempObject.position.copy(position);
            tempObject.lookAt(new THREE.Vector3(position.x * 2, position.y, position.z * 2));
            helixTargets.push(tempObject);
        });

        // Grid Targets
        const buildGridTargets = (layerOffset: number | "all") => {
            gridTargets.length = 0;
            profiles.forEach((_, index) => {
                const x = index % 5;
                const y = Math.floor(index / 5) % 4;
                const z = Math.floor(index / 20);

                const tempObject = new THREE.Object3D();
                let zPos = z * 220 - ((maxGridLayers - 1) * 220) / 2;
                if (layerOffset !== "all") {
                    zPos = (z - layerOffset) * 320;
                }

                tempObject.position.set(x * 220 - (4 * 220) / 2, -y * 260 + (3 * 260) / 2, zPos);
                gridTargets.push(tempObject);
            });
        };
        buildGridTargets("all");

        // Combined Layout Transformation + Camera & Model Reset
        const transform = (layoutName: Layout, targets: THREE.Object3D[]) => {
            tweenGroup.removeAll();
            controls.enabled = false;

            const startCamPos = camera.position.clone();
            const startTarget = controls.target.clone();
            const startUp = camera.up.clone();
            const startQuat = visualizationGroup.quaternion.clone();

            const endCamPos = defaultCameraPosition.clone();
            const endTarget = defaultCameraTarget.clone();
            const endUp = new THREE.Vector3(0, 1, 0);
            const endQuat = new THREE.Quaternion();

            const startRot = { ...rotationRef.current };

            // Enable smooth auto-rotation if sphere or helix
            autoRotateRef.current = (layoutName === "sphere" || layoutName === "helix");

            objects.forEach((object, index) => {
                const target = targets[index];
                if (!target) return;

                const fromPos = object.position.clone();
                const fromQuat = object.quaternion.clone();

                new Tween({ t: 0 }, tweenGroup)
                    .to({ t: 1 }, 1200)
                    .easing(Easing.Exponential.InOut)
                    .onUpdate(({ t }) => {
                        object.position.lerpVectors(fromPos, target.position, t);
                        object.quaternion.slerpQuaternions(fromQuat, target.quaternion, t);
                    })
                    .start();
            });

            new Tween({ t: 0 }, tweenGroup)
                .to({ t: 1 }, 1200)
                .easing(Easing.Exponential.InOut)
                .onUpdate(({ t }) => {
                    // Smoothly reset camera & controls
                    camera.position.lerpVectors(startCamPos, endCamPos, t);
                    controls.target.lerpVectors(startTarget, endTarget, t);
                    camera.up.lerpVectors(startUp, endUp, t);
                    camera.lookAt(controls.target);

                    // Smoothly reset model group quaternion
                    visualizationGroup.quaternion.slerpQuaternions(startQuat, endQuat, t);

                    // Reset rotation sliders state
                    const curX = THREE.MathUtils.lerp(startRot.x, 0, t);
                    const curY = THREE.MathUtils.lerp(startRot.y, 0, t);
                    const curZ = THREE.MathUtils.lerp(startRot.z, 0, t);
                    rotationRef.current = { x: curX, y: curY, z: curZ };
                    setRotation({ x: Math.round(curX), y: Math.round(curY), z: Math.round(curZ) });
                })
                .onComplete(() => {
                    camera.position.copy(defaultCameraPosition);
                    controls.target.copy(defaultCameraTarget);
                    camera.up.copy(endUp);

                    visualizationGroup.quaternion.identity();
                    visualizationGroup.rotation.set(0, 0, 0);

                    rotationRef.current = { x: 0, y: 0, z: 0 };
                    setRotation({ x: 0, y: 0, z: 0 });

                    controls.update();
                    controls.enabled = true;
                })
                .start();
        };

        transformRef.current = (layout: Layout) => {
            activeLayoutRef.current = layout;
            setActiveLayout(layout);
            setSelectedGridLayer("all");
            buildGridTargets("all");

            objects.forEach((obj) => (obj.element.style.opacity = "1"));

            switch (layout) {
                case "table":
                    transform("table", tableTargets);
                    break;
                case "sphere":
                    transform("sphere", sphereTargets);
                    break;
                case "helix":
                    transform("helix", helixTargets);
                    break;
                case "grid":
                    transform("grid", gridTargets);
                    break;
            }
        };

        // Dynamic Grid Layer Transition
        updateGridLayerRef.current = (layer: number | "all") => {
            buildGridTargets(layer);
            autoRotateRef.current = false;

            objects.forEach((object, index) => {
                const zIndex = Math.floor(index / 20);
                const target = gridTargets[index];

                // Dim non-selected layers when scrolling specific layer
                if (layer !== "all" && zIndex !== layer) {
                    object.element.style.opacity = "0.1";
                } else {
                    object.element.style.opacity = "1";
                }

                if (!target) return;
                const fromPos = object.position.clone();

                new Tween({ t: 0 }, tweenGroup)
                    .to({ t: 1 }, 600)
                    .easing(Easing.Quadratic.Out)
                    .onUpdate(({ t }) => {
                        object.position.lerpVectors(fromPos, target.position, t);
                    })
                    .start();
            });
        };

        // Model Axis Rotation
        const applyModelRotation = (xDeg: number, yDeg: number, zDeg: number) => {
            const euler = new THREE.Euler(
                THREE.MathUtils.degToRad(xDeg),
                THREE.MathUtils.degToRad(yDeg),
                THREE.MathUtils.degToRad(zDeg),
                "YXZ"
            );
            visualizationGroup.quaternion.setFromEuler(euler);
        };

        setRotationRef.current = (x: number, y: number, z: number) => {
            autoRotateRef.current = false;
            rotationRef.current = { x, y, z };
            applyModelRotation(x, y, z);
        };

        // Camera & Rotation Reset
        resetViewRef.current = () => {
            autoRotateRef.current = activeLayoutRef.current === "sphere" || activeLayoutRef.current === "helix";
            setSelectedGridLayer("all");
            buildGridTargets("all");
            objects.forEach((obj) => (obj.element.style.opacity = "1"));

            if (activeLayoutRef.current === "grid") {
                transform("grid", gridTargets);
            } else if (activeLayoutRef.current === "sphere") {
                transform("sphere", sphereTargets);
            } else if (activeLayoutRef.current === "helix") {
                transform("helix", helixTargets);
            } else {
                transform("table", tableTargets);
            }
        };

        // Keyboard Shortcuts
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
            const key = event.key.toLowerCase();
            const layoutMap: Record<string, Layout> = { t: "table", s: "sphere", h: "helix", g: "grid" };

            if (layoutMap[key]) transformRef.current?.(layoutMap[key]);
            if (key === "r") resetViewRef.current?.();
        };

        window.addEventListener("keydown", handleKeyDown);

        // Animation Loop
        let animationFrameId: number;
        const animate = (time: number) => {
            animationFrameId = requestAnimationFrame(animate);
            tweenGroup.update(time);

            // Subtle continuous auto-rotation for Sphere & Helix
            if (autoRotateRef.current && (activeLayoutRef.current === "sphere" || activeLayoutRef.current === "helix")) {
                visualizationGroup.rotation.y += 0.0008;
            }

            if (controls.enabled) {
                controls.update();
            }

            renderer.render(scene, camera);
        };

        animationFrameId = requestAnimationFrame(animate);

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            controls.handleResize();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("keydown", handleKeyDown);
            tweenGroup.removeAll();
            controls.dispose();
            renderer.domElement.remove();
            transformRef.current = null;
            resetViewRef.current = null;
            setRotationRef.current = null;
            updateGridLayerRef.current = null;
        };
    }, [profiles]);

    const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
        const next = { ...rotationRef.current, [axis]: value };
        rotationRef.current = next;
        setRotation(next);
        setRotationRef.current?.(next.x, next.y, next.z);
    };

    const stopUIPropagation = (e: React.SyntheticEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="visualization">
            <div ref={containerRef} className="visualization-canvas" />

            {/* Header */}
            <div
                className="visualization-header"
                onPointerDown={stopUIPropagation}
                onMouseDown={stopUIPropagation}
                onTouchStart={stopUIPropagation}
                onWheel={stopUIPropagation}
            >
                <div>
                    <div className="visualization-title">Profile Visualizer</div>
                    <div className="visualization-subtitle">{profiles.length} profiles</div>
                </div>
            </div>

            {/* Reset Camera Button */}
            <button
                className="reset-view"
                onClick={() => resetViewRef.current?.()}
                onPointerDown={stopUIPropagation}
                onMouseDown={stopUIPropagation}
                onTouchStart={stopUIPropagation}
                onWheel={stopUIPropagation}
                title="Reset View & Rotation"
            >
                <span className="reset-icon"><ResetIcon /></span>
                Reset Camera
            </button>

            {/* Model Rotation Control Panel */}
            <div
                className="rotation-panel"
                onPointerDown={stopUIPropagation}
                onMouseDown={stopUIPropagation}
                onTouchStart={stopUIPropagation}
                onWheel={stopUIPropagation}
            >
                <div className="rotation-header">
                    <span className="rotation-title">Model Rotation</span>
                    {(rotation.x !== 0 || rotation.y !== 0 || rotation.z !== 0) && (
                        <button
                            className="rotation-reset-btn"
                            onClick={() => {
                                handleRotationChange("x", 0);
                                handleRotationChange("y", 0);
                                handleRotationChange("z", 0);
                            }}
                        >
                            Reset
                        </button>
                    )}
                </div>

                {(["x", "y", "z"] as const).map((axis) => (
                    <div className="rotation-row" key={axis}>
                        <span className="rotation-label">{axis.toUpperCase()}</span>
                        <input
                            type="range"
                            min="-180"
                            max="180"
                            step="1"
                            value={rotation[axis]}
                            onChange={(event) => handleRotationChange(axis, Number(event.target.value))}
                        />
                        <span className="rotation-value">{rotation[axis]}°</span>
                    </div>
                ))}
            </div>

            {/* Grid Layer Scroll UI (Only visible when Grid layout is active) */}
            {activeLayout === "grid" && (
                <div
                    className="rotation-panel"
                    style={{ top: "220px" }}
                    onPointerDown={stopUIPropagation}
                    onMouseDown={stopUIPropagation}
                    onTouchStart={stopUIPropagation}
                    onWheel={stopUIPropagation}
                >
                    <div className="rotation-header">
                        <span className="rotation-title">Grid Layer Scroll</span>
                        <button
                            className="rotation-reset-btn"
                            onClick={() => {
                                setSelectedGridLayer("all");
                                updateGridLayerRef.current?.("all");
                            }}
                        >
                            Show All
                        </button>
                    </div>
                    <div className="rotation-row">
                        <span className="rotation-label">LAYER</span>
                        <input
                            type="range"
                            min="0"
                            max={maxGridLayers - 1}
                            step="1"
                            value={selectedGridLayer === "all" ? 0 : selectedGridLayer}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setSelectedGridLayer(val);
                                updateGridLayerRef.current?.(val);
                            }}
                        />
                        <span className="rotation-value">
                            {selectedGridLayer === "all" ? "All" : `${selectedGridLayer + 1}/${maxGridLayers}`}
                        </span>
                    </div>
                </div>
            )}

            {/* Layout Dock */}
            <div
                className="layout-dock"
                onPointerDown={stopUIPropagation}
                onMouseDown={stopUIPropagation}
                onTouchStart={stopUIPropagation}
                onWheel={stopUIPropagation}
            >
                <button
                    className={`layout-button ${activeLayout === "table" ? "active" : ""}`}
                    onClick={() => transformRef.current?.("table")}
                >
                    <span className="layout-icon"><TableIcon /></span>
                    <span>Table</span>
                    <span className="layout-key">T</span>
                </button>

                <button
                    className={`layout-button ${activeLayout === "sphere" ? "active" : ""}`}
                    onClick={() => transformRef.current?.("sphere")}
                >
                    <span className="layout-icon"><SphereIcon /></span>
                    <span>Sphere</span>
                    <span className="layout-key">S</span>
                </button>

                <button
                    className={`layout-button ${activeLayout === "helix" ? "active" : ""}`}
                    onClick={() => transformRef.current?.("helix")}
                >
                    <span className="layout-icon"><HelixIcon /></span>
                    <span>Helix</span>
                    <span className="layout-key">H</span>
                </button>

                <button
                    className={`layout-button ${activeLayout === "grid" ? "active" : ""}`}
                    onClick={() => transformRef.current?.("grid")}
                >
                    <span className="layout-icon"><GridIcon /></span>
                    <span>Grid</span>
                    <span className="layout-key">G</span>
                </button>
            </div>

            {/* Mouse & Keyboard Controls Tooltip */}
            <div
                className="controls-wrapper"
                onPointerDown={stopUIPropagation}
                onMouseDown={stopUIPropagation}
                onTouchStart={stopUIPropagation}
                onWheel={stopUIPropagation}
            >
                <button
                    className="controls-toggle"
                    onClick={() => setShowControls(!showControls)}
                    aria-expanded={showControls}
                >
                    <span>ⓘ</span>
                    Controls
                    <span className={`controls-chevron ${showControls ? "open" : ""}`}>▾</span>
                </button>

                {showControls && (
                    <div className="controls-tooltip">
                        <div className="tooltip-heading">MOUSE CONTROLS</div>
                        <div className="tooltip-section">
                            <div className="tooltip-row"><span>Left Click + Drag</span><span>Rotate View</span></div>
                            <div className="tooltip-row"><span>Mouse Wheel</span><span>Zoom In / Out</span></div>
                            <div className="tooltip-row"><span>Right Click + Drag</span><span>Pan View</span></div>
                        </div>
                        <div className="tooltip-divider" />
                        <div className="tooltip-heading">SHORTCUTS</div>
                        <div className="tooltip-section">
                            <div className="tooltip-row"><span>T</span><span>Table</span></div>
                            <div className="tooltip-row"><span>S</span><span>Sphere</span></div>
                            <div className="tooltip-row"><span>H</span><span>Helix</span></div>
                            <div className="tooltip-row"><span>G</span><span>Grid</span></div>
                            <div className="tooltip-row"><span>R</span><span>Reset View</span></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}