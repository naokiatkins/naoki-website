"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Bar heights (0–1): a growth trend the scatter settles into
const BARS = [0.35, 0.55, 0.45, 0.7, 0.6, 0.85, 0.75, 1];
const STEP = 0.12; // spacing between points inside a bar
const MAX_LAYERS = 25;
const BAR_GAP = 0.7;

export default function DataScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return; // No WebGL: the page works without the background
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.6, 9);

    // Target positions: each bar is a 3×3 column of points
    const chart: number[] = [];
    BARS.forEach((h, i) => {
      const x = (i - (BARS.length - 1) / 2) * BAR_GAP;
      for (let layer = 0; layer < Math.round(h * MAX_LAYERS); layer++)
        for (let a = -1; a <= 1; a++)
          for (let b = -1; b <= 1; b++)
            chart.push(x + a * STEP, -1.5 + layer * STEP, b * STEP);
    });
    const count = chart.length / 3;
    const scatter = Float32Array.from({ length: count * 3 }, (_, i) =>
      (Math.random() - 0.5) * [5.5, 4.5, 4][i % 3]
    );
    const delay = Float32Array.from({ length: count }, Math.random);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(scatter);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Round dots instead of WebGL's default squares
    const dot = document.createElement("canvas");
    dot.width = dot.height = 32;
    const ctx = dot.getContext("2d")!;
    ctx.fillStyle = "#fff"; // white so the material colour shows through unchanged
    ctx.beginPath();
    ctx.arc(16, 16, 15, 0, Math.PI * 2);
    ctx.fill();
    const material = new THREE.PointsMaterial({
      color: 0xc4501a,
      size: 0.08,
      map: new THREE.CanvasTexture(dot),
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    const group = new THREE.Group();
    group.add(new THREE.Points(geometry, material));
    scene.add(group);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 0 at the top of the page, 1 once the Work section is in view
    const target = () => {
      const work = document.getElementById("work");
      const end = work ? work.offsetTop - window.innerHeight * 0.4 : window.innerHeight;
      return Math.min(1, Math.max(0, window.scrollY / Math.max(end, 1)));
    };

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      group.position.x = w > 768 ? 2 : 0; // beside the hero text on wide screens
      group.scale.setScalar(Math.min(1, camera.aspect * 1.25)); // keep all bars on narrow screens
    };
    resize();
    window.addEventListener("resize", resize);

    let progress = reduceMotion ? 1 : target();
    let frame = 0;
    const tick = () => {
      progress = reduceMotion ? 1 : progress + (target() - progress) * 0.06;
      for (let i = 0; i < count; i++) {
        // Stagger points so bars fill in rather than snapping at once
        const t = Math.min(1, Math.max(0, progress * 1.4 - delay[i] * 0.4));
        const e = t * t * (3 - 2 * t);
        for (let k = 0; k < 3; k++) {
          const j = i * 3 + k;
          positions[j] = scatter[j] + (chart[j] - scatter[j]) * e;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      if (!reduceMotion) group.rotation.y += 0.0015;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
    />
  );
}
