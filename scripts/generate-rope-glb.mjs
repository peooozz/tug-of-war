// Script to generate a realistic braided 3D rope GLB model matching exact hand heights
import * as fs from 'fs';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

// Polyfill FileReader for Node.js
if (typeof FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    constructor() {
      this.result = null;
      this.onloadend = null;
    }
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
      });
    }
  };
}

function createBraidedRopeScene() {
  const scene = new THREE.Scene();
  scene.name = 'TugOfWarRopeScene';

  const group = new THREE.Group();
  group.name = 'RopeRoot';

  // Realistic Hemp Rope Material
  const ropeMaterial = new THREE.MeshStandardMaterial({
    color: 0xC98E56,
    roughness: 0.88,
    metalness: 0.06,
    name: 'HempRopeMaterial',
  });

  // Center Brass Clasp Material
  const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xF59E0B,
    metalness: 0.85,
    roughness: 0.25,
    name: 'BrassClaspMaterial',
  });

  // Red Ribbon Material
  const ribbonMaterial = new THREE.MeshStandardMaterial({
    color: 0xEF4444,
    roughness: 0.4,
    side: THREE.DoubleSide,
    name: 'RibbonMaterial',
  });

  // 8.6m long rope spanning cleanly through 3 characters on left and 3 on right
  const ropeLength = 8.6;
  const numSteps = 200;
  const turns = 28;
  const radius = 0.020;
  const strandRadius = 0.018;

  // Exact height matching the characters' natural gripped fists (y = 0.35)
  const ROPE_HEIGHT = 0.35;

  for (let s = 0; s < 3; s++) {
    const angleOffset = (s * 2 * Math.PI) / 3;
    const points = [];

    for (let i = 0; i <= numSteps; i++) {
      const t = i / numSteps;
      const x = -ropeLength / 2 + t * ropeLength;

      // Slight natural catenary between the two lead pullers (-1.35 to 1.35)
      let sag = 0;
      if (Math.abs(x) < 1.35) {
        sag = Math.cos((x / 1.35) * (Math.PI / 2)) * -0.012;
      }
      let y = ROPE_HEIGHT + sag;

      // Trailing ends drop to the arena floor beyond the back anchors (|x| > 3.65m)
      if (x < -3.65) {
        const dropRatio = THREE.MathUtils.clamp((-x - 3.65) / 0.65, 0, 1);
        y = ROPE_HEIGHT - dropRatio * (ROPE_HEIGHT - 0.06);
      } else if (x > 3.65) {
        const dropRatio = THREE.MathUtils.clamp((x - 3.65) / 0.65, 0, 1);
        y = ROPE_HEIGHT - dropRatio * (ROPE_HEIGHT - 0.06);
      }

      const spiralAngle = t * turns * 2 * Math.PI + angleOffset;
      const yOffset = Math.sin(spiralAngle) * radius;
      const zOffset = Math.cos(spiralAngle) * radius;

      points.push(new THREE.Vector3(x, y + yOffset, zOffset));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const strandGeom = new THREE.TubeGeometry(curve, 160, strandRadius, 6, false);
    const strandMesh = new THREE.Mesh(strandGeom, ropeMaterial);
    strandMesh.name = `Strand_${s + 1}`;
    strandMesh.castShadow = true;
    strandMesh.receiveShadow = true;
    group.add(strandMesh);
  }

  // Center Brass Clasp Ring at y = 0.275
  const ringGeom = new THREE.TorusGeometry(0.075, 0.024, 8, 24);
  const ringMesh = new THREE.Mesh(ringGeom, brassMaterial);
  ringMesh.name = 'CenterRingClasp';
  ringMesh.position.set(0, ROPE_HEIGHT - 0.025, 0);
  ringMesh.castShadow = true;
  group.add(ringMesh);

  // Center Hanging Ribbon
  const ribbonGeom = new THREE.PlaneGeometry(0.12, 0.26);
  const ribbonMesh = new THREE.Mesh(ribbonGeom, ribbonMaterial);
  ribbonMesh.name = 'CenterMarkerRibbon';
  ribbonMesh.position.set(0, ROPE_HEIGHT - 0.16, 0);
  ribbonMesh.castShadow = true;
  group.add(ribbonMesh);

  // Center Top Gold Pin
  const pinGeom = new THREE.ConeGeometry(0.055, 0.12, 8);
  const pinMesh = new THREE.Mesh(pinGeom, brassMaterial);
  pinMesh.name = 'CenterTopPin';
  pinMesh.position.set(0, ROPE_HEIGHT + 0.07, 0);
  group.add(pinMesh);

  scene.add(group);
  return scene;
}

function exportGLB() {
  const scene = createBraidedRopeScene();
  const exporter = new GLTFExporter();

  exporter.parse(
    scene,
    (gltf) => {
      const buffer = Buffer.from(gltf);
      fs.writeFileSync('public/models/rope.glb', buffer);
      console.log(`Exported public/models/rope.glb (${(buffer.length / 1024).toFixed(1)} KB) successfully!`);
    },
    (err) => {
      console.error('Failed to export rope.glb:', err);
    },
    { binary: true }
  );
}

exportGLB();
