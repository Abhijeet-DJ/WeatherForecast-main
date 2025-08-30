import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Rotating Globe Component (React + Three.js)
 *
 * Props:
 *  - textureUrl?: string  (URL/path to an equirectangular Earth texture)
 *  - bumpUrl?: string     (optional bump/height map for subtle relief)
 *  - specularUrl?: string (optional specular map for oceans shine)
 *  - autoRotateSpeed?: number (default 0.4)
 *  - className?: string
 *  - style?: React.CSSProperties
 *  - dprMax?: number (cap device pixel ratio; default 2)
 *
 * Usage:
 *  <Globe textureUrl="/textures/earth_daymap.jpg" style={{ height: 420 }} />
 */
export default function Globe({
  textureUrl,
  bumpUrl,
  specularUrl,
  autoRotateSpeed = 0.4,
  className,
  style,
  dprMax = 2,
}) {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 2.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprMax));
    rendererRef.current = renderer;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 5.1);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    // Globe
    const geometry = new THREE.SphereGeometry(1, 128, 128);
    const material = new THREE.MeshStandardMaterial({ color: 0x88aaff, roughness: 1, metalness: 0 });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Optional starfield for a nice backdrop
    const stars = makeStars(1200, 30);
    scene.add(stars);

    // Load textures (if provided)
    const loader = new THREE.TextureLoader();
    if (textureUrl) {
      loader.load(
        textureUrl,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 8;
          material.map = tex;
          material.needsUpdate = true;
        },
        undefined,
        () => {
          // texture failed — keep solid color
        }
      );
    }
    if (bumpUrl) {
      loader.load(
        bumpUrl,
        (tex) => {
          tex.anisotropy = 8;
          material.bumpMap = tex;
          material.bumpScale = 0.02;
          material.needsUpdate = true;
        },
        undefined,
        () => {}
      );
    }
    if (specularUrl) {
      loader.load(
        specularUrl,
        (tex) => {
          tex.anisotropy = 8;
          material.roughnessMap = tex; // use as a pseudo specular/roughness detail
          material.needsUpdate = true;
        },
        undefined,
        () => {}
      );
    }

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = autoRotateSpeed; // revolutions per 60 frames-ish
    controlsRef.current = controls;

    // Resize handling
    const resize = () => {
      const { clientWidth, clientHeight } = canvas.parentElement || canvas;
      const width = clientWidth || 600;
      const height = clientHeight || 400;
      const dpr = Math.min(window.devicePixelRatio || 1, dprMax);
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || canvas);

    // Animate
    const clock = new THREE.Clock();
    const loop = () => {
      const delta = clock.getDelta();
      controls.autoRotateSpeed = autoRotateSpeed;
      controls.update();
      // Subtle base rotation to ensure movement even when user stops interacting
      globe.rotation.y += delta * autoRotateSpeed * 0.2;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(loop);
    };

    loop();

    // Cleanup
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      controls.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, [textureUrl, bumpUrl, specularUrl, autoRotateSpeed, dprMax]);

  return (
    <div className={"relative w-full h-full " + (className || "")} style={{ minHeight: 320, ...style }}>
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Optional shadow/overlay styling could go here */}
    </div>
  );
}

function makeStars(count = 800, radius = 50) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Random point on a sphere shell
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius + (Math.random() - 0.5) * 2; // small jitter
    positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ size: 0.02, transparent: true, opacity: 0.75 });
  return new THREE.Points(geometry, material);
}