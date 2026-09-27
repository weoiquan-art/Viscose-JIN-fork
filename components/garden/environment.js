import * as THREE from "three";

// Phase 1: a real creek reach and two banks around the wheel. The outer
// feather meets the existing plate; trees, meadow beyond it and lamp are 2D.
// Coordinates are metres in the wheel's shared, pitched world (Y is up).
export function createGardenEnvironment(p) {
  const root = new THREE.Group(); root.name = "Creek_and_banks";
  const waterY = -p.radius - 0.12;
  const halfLength = 6.8, halfWidth = 0.95;
  const center = (x) => 0.55 + x * 0.18 + Math.sin(x * 0.7) * 0.12;
  const edge = (x) => 1 - THREE.MathUtils.smoothstep(Math.abs(x), 4.5, halfLength);
  let seed = 731;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const height = (x, t) => waterY - 0.12 + Math.sin(Math.min(t / 0.35, 1) * Math.PI / 2) * 0.24
    + Math.sin(x * 2.3 + t * 3) * 0.025;

  // Sampled cross-sections make a depressed creek bed and gently raised banks.
  function strip(name, rows, columns, point, material) {
    const positions = [], colors = [], indices = [];
    for (let i = 0; i <= rows; i++) for (let j = 0; j <= columns; j++) {
      const x = (i / rows * 2 - 1) * halfLength;
      const {y, z, color, alpha} = point(x, j / columns);
      positions.push(x, y, z); colors.push(color.r, color.g, color.b, alpha * edge(x));
      if (i < rows && j < columns) {
        const a = i * (columns + 1) + j, b = a + columns + 1;
        indices.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
    geometry.setIndex(indices); geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, material); mesh.name = name;
    mesh.receiveShadow = true; root.add(mesh); return mesh;
  }
  const soil = new THREE.Color("#84714a"), grass = new THREE.Color("#728133");
  const bankMaterial = new THREE.MeshStandardMaterial({vertexColors: true, roughness: 1,
    side: THREE.DoubleSide, transparent: true, depthWrite: false});
  for (const side of [-1, 1]) strip(`Bank_${side}`, 100, 16, (x, t) => ({
    y: height(x, t), z: center(x) + side * (halfWidth + t * 1.15),
    color: soil.clone().lerp(grass, THREE.MathUtils.smoothstep(t, 0, 0.3)).multiplyScalar(0.88 + random() * 0.24),
    alpha: 1 - THREE.MathUtils.smoothstep(t, 0.48, 1),
  }), bankMaterial);

  const bedMaterial = new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.95,
    transparent: true, depthWrite: false, side: THREE.DoubleSide});
  strip("Creek_bed", 100, 12, (x, t) => ({y: waterY - 0.15 - Math.sin(t * Math.PI) * 0.14,
    z: center(x) + (t * 2 - 1) * halfWidth, color: new THREE.Color("#807253").multiplyScalar(0.7 + random() * 0.5), alpha: 1,
  }), bedMaterial);

  const waterMaterial = new THREE.MeshStandardMaterial({color: "#799d9b", metalness: 0.22,
    roughness: 0.24, transparent: true, opacity: 0.62, vertexColors: true, depthWrite: false,
    side: THREE.DoubleSide});
  const surface = strip("Flowing_water", 100, 16, (x, t) => ({y: waterY,
    z: center(x) + (t * 2 - 1) * halfWidth, color: new THREE.Color("#ffffff"),
    alpha: Math.min(1, Math.sin(t * Math.PI) * 4),
  }), waterMaterial);
  surface.renderOrder = 2;
  const waterPositions = surface.geometry.attributes.position;
  const waterBase = waterPositions.array.slice();

  // Shared geometries and instancing keep the new planting inexpensive.
  const dummy = new THREE.Object3D();
  const pebbleGeometry = new THREE.IcosahedronGeometry(1, 1);
  const pebbleMaterial = new THREE.MeshStandardMaterial({color: "#a49b7f", roughness: 0.87});
  const stones = new THREE.InstancedMesh(pebbleGeometry, pebbleMaterial, 240);
  stones.name = "Shore_and_bed_stones"; stones.castShadow = stones.receiveShadow = true;
  root.add(stones);
  const stoneColor = new THREE.Color();
  for (let i = 0; i < stones.count; i++) {
    const x = (random() * 2 - 1) * 6.1;
    const shore = i < 180, side = i % 2 ? 1 : -1;
    const z = center(x) + (shore ? side * (halfWidth + random() * 0.14) : (random() * 2 - 1) * 0.8);
    const size = (0.055 + random() * 0.10) * edge(x);
    dummy.position.set(x, waterY - (shore ? 0.01 : 0.18), z);
    dummy.rotation.set(random(), random() * Math.PI, random());
    dummy.scale.set(size * (1.2 + random()), size * 0.65, size);
    dummy.updateMatrix(); stones.setMatrixAt(i, dummy.matrix);
    stones.setColorAt(i, stoneColor.setHSL(0.10 + random() * 0.05, 0.12, 0.34 + random() * 0.25));
  }
  // Two small masonry plinths carry the A-frame feet at their actual positions.
  const footings = new THREE.Group(); footings.name = "Wheel_foundations";
  const footingMaterial = new THREE.MeshStandardMaterial({color: "#827d64", roughness: 0.95});
  for (const z of [-0.56, 0.56]) {
    const footing = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.18, 0.44), footingMaterial);
    footing.position.set(0, -p.radius - 0.20, z); footing.receiveShadow = footing.castShadow = true;
    footings.add(footing);
  }

  const bladeGeometry = new THREE.BufferGeometry();
  bladeGeometry.setAttribute("position", new THREE.Float32BufferAttribute([
    -0.032, 0, 0, 0.032, 0, 0, 0.022, 0.15, 0.018, -0.018, 0.15, 0.018, 0.03, 0.32, 0.055,
  ], 3));
  bladeGeometry.setIndex([0, 1, 2, 0, 2, 3, 3, 2, 4]); bladeGeometry.computeVertexNormals();
  const bladeMaterial = new THREE.MeshStandardMaterial({color: "#a4ae60", roughness: 0.9, side: THREE.DoubleSide});
  const blades = new THREE.InstancedMesh(bladeGeometry, bladeMaterial, p.bankGrass);
  blades.name = "Bank_grass"; blades.receiveShadow = true; root.add(blades);
  const grassColor = new THREE.Color();
  for (let i = 0; i < blades.count; i++) {
    const x = (random() * 2 - 1) * 6.2, t = 0.13 + random() * 0.6;
    dummy.position.set(x, height(x, t), center(x) + (i % 2 ? 1 : -1) * (halfWidth + t * 1.15));
    dummy.rotation.set(0, random() * Math.PI * 2, (random() - 0.5) * 0.3);
    const size = (0.4 + random() * 0.9) * edge(x) * (1 - t * 0.5);
    dummy.scale.setScalar(size); dummy.updateMatrix(); blades.setMatrixAt(i, dummy.matrix);
    blades.setColorAt(i, grassColor.setHSL(0.19 + random() * 0.08, 0.36 + random() * 0.25, 0.26 + random() * 0.18));
  }

  // Low-amplitude geometry waves + drifting glints, driven by the existing
  // scene clock. Paused/reduced-motion stops this clock, including water.
  const glints = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({color: "#eff8df", transparent: true, opacity: 0.27, depthWrite: false, side: THREE.DoubleSide}), 80);
  glints.name = "Current_glints"; glints.renderOrder = 3; root.add(glints);
  const tracks = Array.from({length: glints.count}, () => ({x: random() * 2 - 1, z: (random() * 2 - 1) * 0.78, size: 0.035 + random() * 0.12}));
  let previousTime = -1;
  function update(time, night) {
    waterMaterial.color.set("#799d9b").lerp(new THREE.Color("#354f66"), night);
    glints.material.opacity = THREE.MathUtils.lerp(0.27, 0.1, night);
    if (time === previousTime) return;
    previousTime = time;
    for (let i = 0; i < waterPositions.count; i++) {
      const j = i * 3, x = waterBase[j], z = waterBase[j + 2];
      waterPositions.array[j + 1] = waterY + Math.sin(x * 8 - time * 1.9 + z * 6) * 0.011
        + Math.sin(x * 3 - time * 1.2 - z * 9) * 0.008;
    }
    waterPositions.needsUpdate = true; surface.geometry.computeVertexNormals();
    tracks.forEach((track, i) => {
      const x = ((track.x + 1 + time * 0.022) % 2 - 1) * halfLength;
      dummy.position.set(x, waterY + 0.027, center(x) + track.z);
      dummy.rotation.set(-Math.PI / 2, 0, -0.18);
      dummy.scale.set(track.size * edge(x), 0.013, 1); dummy.updateMatrix(); glints.setMatrixAt(i, dummy.matrix);
    });
    glints.instanceMatrix.needsUpdate = true;
  }
  return {root, footings, update};
}
