import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Deterministic oak grain. This texture is authored in code, not baked lighting.
function oakTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#b08450";
  ctx.fillRect(0, 0, 512, 512);
  let seed = 32;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < 1400; i++) {
    const x = rand() * 512;
    ctx.strokeStyle = `rgba(${rand() > 0.5 ? "57,28,10" : "228,192,132"},${0.08 + rand() * 0.2})`;
    ctx.lineWidth = 0.3 + rand() * 1.4;
    ctx.beginPath(); ctx.moveTo(x, 0);
    for (let y = 0; y <= 512; y += 16)
      ctx.lineTo(x + Math.sin(y * 0.016 + i) * (1 + rand() * 3), y);
    ctx.stroke();
  }
  for (let i = 0; i < 7; i++) {
    const x = rand() * 512, y = rand() * 512;
    for (let j = 1; j < 9; j++) {
      ctx.strokeStyle = "rgba(64,34,12,0.17)";
      ctx.beginPath(); ctx.ellipse(x, y, j * 1.8, j * 6, 0, 0, Math.PI * 2); ctx.stroke();
    }
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  return map;
}

function bevelBox(w, h, d, bevel = 0.015) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, -h / 2); shape.lineTo(w / 2, -h / 2);
  shape.lineTo(w / 2, h / 2); shape.lineTo(-w / 2, h / 2); shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.005, d - bevel * 2), bevelEnabled: true,
    bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, steps: 1,
  });
  g.translate(0, 0, -d / 2 + bevel);
  return g;
}

// Merge by material within each assembly: independent rotor, stationary frame.
function consolidate(group) {
  const batches = new Map();
  group.updateMatrixWorld(true);
  group.traverse((node) => {
    if (!node.isMesh) return;
    const g = node.geometry.clone().applyMatrix4(node.matrixWorld);
    const flat = g.index ? g.toNonIndexed() : g;
    if (flat !== g) g.dispose();
    if (!batches.has(node.material)) batches.set(node.material, []);
    batches.get(node.material).push(flat);
    node.geometry.dispose();
  });
  group.clear();
  batches.forEach((geometries, material) => {
    const mesh = new THREE.Mesh(mergeGeometries(geometries), material);
    mesh.name = `${group.name}_${material.name}`;
    mesh.castShadow = mesh.receiveShadow = true;
    group.add(mesh);
    geometries.forEach((g) => g.dispose());
  });
}

export function createWaterwheel(p) {
  const root = new THREE.Group(); root.name = "JIN_Waterwheel";
  const rotor = new THREE.Group(); rotor.name = "Rotor";
  const frame = new THREE.Group(); frame.name = "Fixed_frame_and_flume";
  const map = oakTexture();
  const oak = new THREE.MeshStandardMaterial({map, roughness: 0.78, color: "#d0ae81", bumpMap: map, bumpScale: 0.022});
  oak.name = "Weathered_oak";
  const endgrain = oak.clone(); endgrain.color.set("#a67e4f"); endgrain.name = "Dark_oak";
  const iron = new THREE.MeshStandardMaterial({color: "#403b32", metalness: 0.74, roughness: 0.55}); iron.name = "Forged_iron";
  const wet = oak.clone(); wet.color.set("#795435"); wet.roughness = 0.35; wet.name = "Wet_paddles";
  const add = (parent, geometry, material, x = 0, y = 0, z = 0, angle = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z); mesh.rotation.z = angle; parent.add(mesh); return mesh;
  };
  const box = (parent, w, h, d, mat, x, y, z, angle = 0) => add(parent, bevelBox(w, h, d), mat, x, y, z, angle);
  const R = p.radius, D = p.depth;
  // Two segmented wooden rims, with scarf-like gaps and iron bolts.
  for (const z of [-D / 2, D / 2]) {
    for (let i = 0; i < p.buckets; i++) {
      const a = i * Math.PI * 2 / p.buckets;
      const b = (i + 1) * Math.PI * 2 / p.buckets;
      const shape = new THREE.Shape();
      shape.absarc(0, 0, R, a + 0.006, b - 0.006, false);
      shape.absarc(0, 0, R - p.rimWidth, b - 0.006, a + 0.006, true);
      shape.closePath();
      const g = new THREE.ExtrudeGeometry(shape, {depth: 0.1, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.014, bevelSegments: 2, steps: 1, curveSegments: 4});
      g.translate(0, 0, -0.05);
      add(rotor, g, i % 3 ? oak : endgrain, 0, 0, z);
      for (const r of [R - 0.045, R - p.rimWidth + 0.045]) {
        const bolt = new THREE.CylinderGeometry(0.022, 0.024, 0.022, 6);
        bolt.rotateX(Math.PI / 2);
        add(rotor, bolt, iron, r * Math.cos((a + b) / 2), r * Math.sin((a + b) / 2), z + Math.sign(z) * 0.075);
      }
    }
    for (let i = 0; i < p.spokes; i++) {
      const a = i * Math.PI * 2 / p.spokes;
      box(rotor, 0.145, R - 0.24, 0.11, oak, -Math.sin(a) * 0.82, Math.cos(a) * 0.82, z, a);
    }
    // Flat iron hoops follow both wooden cheeks.
    const hoop = new THREE.TorusGeometry(R - 0.035, 0.018, 5, 96);
    add(rotor, hoop, iron, 0, 0, z + Math.sign(z) * 0.065);
  }
  for (let i = 0; i < p.buckets; i++) {
    const a = i * Math.PI * 2 / p.buckets;
    const x = -Math.sin(a) * (R - 0.025), y = Math.cos(a) * (R - 0.025);
    // Open scoop: cross-board plus raised lip, spanning the two cheeks.
    box(rotor, 0.4, 0.07, D + 0.1, i % 3 ? oak : wet, x, y, 0, a - 0.12);
    box(rotor, 0.06, 0.22, D + 0.1, endgrain,
      x + Math.cos(a) * 0.18 - Math.sin(a) * 0.055,
      y + Math.sin(a) * 0.18 + Math.cos(a) * 0.055, 0, a);
    for (const z of [-D / 2 - 0.03, D / 2 + 0.03])
      box(rotor, 0.40, 0.20, 0.045, oak, x, y + 0.02, z, a);
  }
  const hub = new THREE.CylinderGeometry(0.28, 0.28, D + 0.3, 16);
  hub.rotateX(Math.PI / 2); add(rotor, hub, endgrain);
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    const bolt = new THREE.CylinderGeometry(0.027, 0.027, 0.04, 6); bolt.rotateX(Math.PI / 2);
    add(rotor, bolt, iron, Math.cos(a) * 0.20, Math.sin(a) * 0.20, D / 2 + 0.17);
  }
  const axle = new THREE.CylinderGeometry(0.085, 0.085, 1.32, 16);
  axle.rotateX(Math.PI / 2); add(frame, axle, iron);
  // A-frames support the axle above the creek; the rotor does not carry them.
  for (const z of [-0.56, 0.56]) {
    for (const side of [-1, 1]) {
      const start = new THREE.Vector3(side * 0.67, -R - 0.04, z);
      const end = new THREE.Vector3(0, 0.03, z);
      const v = end.clone().sub(start);
      const post = box(frame, 0.13, v.length(), 0.14, endgrain, 0, 0, 0);
      post.position.copy(start.add(end).multiplyScalar(0.5));
      post.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.normalize());
    }
    box(frame, 1.58, 0.12, 0.23, wet, 0, -R - 0.06, z);
    box(frame, 0.31, 0.2, 0.18, iron, 0, 0, z);
  }
  // A shallow wooden flume delivers water to the upper right paddles.
  box(frame, 1.65, 0.055, 0.24, wet, 1.76, R + 0.29, -0.02, 0.035);
  for (const z of [-0.155, 0.115]) box(frame, 1.65, 0.16, 0.04, oak, 1.76, R + 0.36, z, 0.035);
  box(frame, 0.09, 3.56, 0.11, endgrain, 2.40, 0.23, -0.09);
  consolidate(rotor); consolidate(frame);
  root.add(frame, rotor);
  return {root, rotor, map};
}

export function disposeObject(root) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  root.traverse((o) => {
    if (o.geometry) geometries.add(o.geometry);
    if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
      materials.add(m);
      for (const v of Object.values(m)) if (v?.isTexture) textures.add(v);
    });
  });
  geometries.forEach((g) => g.dispose()); materials.forEach((m) => m.dispose()); textures.forEach((t) => t.dispose());
}
