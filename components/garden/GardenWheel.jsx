"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createWaterwheel, disposeObject } from "./waterwheel";
import {gardenLayout} from "./layout";

export default function GardenWheel({params, night, paused, leaving, onReady, onUnavailable, layoutRef}) {
  const host = useRef(null);
  const live = useRef({night, paused, leaving});
  useEffect(() => { live.current = {night, paused, leaving}; }, [night, paused, leaving]);

  useEffect(() => {
    const el = host.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    } catch {
      onUnavailable(); return;
    }
    let disposed = false, failed = false;
    const p = params;
    renderer.setClearColor(0, 0);
    renderer.setPixelRatio(Math.min(devicePixelRatio, p.dpr));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, 0.1, 60);
    camera.position.z = 12;
    const rig = new THREE.Group(); scene.add(rig);
    const {root, rotor} = createWaterwheel(p);
    root.rotation.set(p.tilt, p.yaw, 0);
    rig.add(root);
    const hemi = new THREE.HemisphereLight("#dceaff", "#726147", 2.2); rig.add(hemi);
    const key = new THREE.DirectionalLight("#fff0d6", p.dayKey);
    key.position.set(-4, 6, 6); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = key.shadow.camera.bottom = -4;
    key.shadow.camera.right = key.shadow.camera.top = 4;
    key.shadow.normalBias = 0.045;
    key.shadow.bias = -0.001;
    rig.add(key, key.target);
    const lamp = new THREE.PointLight("#ffb658", 0, 12, 2); lamp.position.set(3.5, 2.2, 2); rig.add(lamp);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(7, 4), new THREE.ShadowMaterial({opacity: 0.28, depthWrite: false}));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -p.radius - 0.13; ground.receiveShadow = true; root.add(ground);

    // Gravity-driven droplets stay in world space while the rotor turns.
    const drops = new Float32Array(p.particles * 3);
    const dropGeometry = new THREE.BufferGeometry();
    dropGeometry.setAttribute("position", new THREE.BufferAttribute(drops, 3));
    const dropletMaterial = new THREE.PointsMaterial({color: "#e3f7ff", size: 0.025, transparent: true, opacity: 0.65, depthWrite: false});
    const water = new THREE.Points(dropGeometry, dropletMaterial); root.add(water);
    const streamMaterial = new THREE.MeshStandardMaterial({color: "#bde7ea", transparent: true, opacity: 0.5, roughness: 0.2, metalness: 0.25, depthWrite: false});
    const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.06, 0.62, 8), streamMaterial);
    stream.position.set(0.93, 1.64, 0.025); root.add(stream);
    const ripple = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.20, 48), new THREE.MeshBasicMaterial({color: "#d8eef4", transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false}));
    ripple.rotation.x = -Math.PI / 2; ripple.position.set(1.4, -p.radius - 0.03, 0.16); root.add(ripple);

    let dirty = true;
    const resize = () => {
      dirty = true;
      const w = el.clientWidth, h = el.clientHeight;
      if (!w || !h) return;
      const {x, y, px, vars} = gardenLayout(w, h, p);
      const target = layoutRef.current;
      if (target) {
        for (const [name, value] of Object.entries(vars)) target.style.setProperty(name, `${value}px`);
      }
      renderer.setSize(w, h);
      camera.left = -w / (px * 2); camera.right = w / (px * 2);
      camera.top = h / (px * 2); camera.bottom = -h / (px * 2); camera.updateProjectionMatrix();
      rig.position.set((x - w / 2) / px, (h / 2 - y) / px, 0);
    };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motion.matches, visible = !document.hidden, themeMix = live.current.night ? 1 : 0;
    let time = 0, last = 0, frame = 0, first = true;
    const onMotion = () => { reduced = motion.matches; last = 0; };
    const onVisibility = () => {visible = !document.hidden; last = 0;};
    motion.addEventListener("change", onMotion); document.addEventListener("visibilitychange", onVisibility);
    const lose = (event) => {event.preventDefault(); failed = true; onUnavailable();};
    renderer.domElement.addEventListener("webglcontextlost", lose);
    renderer.debug.onShaderError = () => {failed = true; onUnavailable();};
    const day = new THREE.Color("#fff0d6"), moon = new THREE.Color("#94baff");
    const animate = (now) => {
      if (disposed) return;
      frame = requestAnimationFrame(animate);
      if (failed || !visible || (last && now - last < 1000 / p.fps)) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / p.fps; last = now;
      const target = live.current.night ? 1 : 0;
      const oldMix = themeMix;
      themeMix = reduced ? target : THREE.MathUtils.damp(themeMix, target, 5 / p.transition, dt);
      const stopped = reduced || live.current.paused;
      if (!stopped) {
        time += dt;
        rotor.rotation.z -= dt * p.rpm * Math.PI / 30 * (live.current.leaving ? 2.4 : 1);
      }
      if (stopped && !first && !dirty && Math.abs(themeMix - oldMix) < 0.00001 && target === Math.round(themeMix)) return;
      dirty = false;
      root.rotation.set(p.tilt, p.yaw, 0);
      hemi.intensity = THREE.MathUtils.lerp(2.2, 0.8, themeMix);
      hemi.groundColor.set(themeMix > 0.5 ? "#202d3e" : "#726147");
      key.intensity = THREE.MathUtils.lerp(p.dayKey, p.nightKey, themeMix); key.color.copy(day).lerp(moon, themeMix);
      lamp.intensity = p.nightLamp * themeMix;
      renderer.toneMappingExposure = THREE.MathUtils.lerp(p.dayExposure, p.nightExposure, themeMix);
      for (let i = 0; i < p.particles; i++) {
        const t = (time * 0.7 + i / p.particles) % 1;
        const j = i * 3;
        drops[j] = 0.94 + t * 0.72 + Math.sin(i * 12.31) * t * 0.12;
        drops[j + 1] = 1.85 - 3.62 * t * t;
        drops[j + 2] = Math.sin(i * 7.17) * 0.19;
      }
      dropGeometry.attributes.position.needsUpdate = true;
      ripple.scale.setScalar(1 + (time * 0.7 % 1) * 2);
      ripple.material.opacity = 0.24 * (1 - (time * 0.7 % 1));
      renderer.render(scene, camera);
      el.dataset.angle = rotor.rotation.z.toFixed(4);
      el.dataset.themeMix = themeMix.toFixed(3);
      if (first && !failed) {first = false; onReady();}
    };
    frame = requestAnimationFrame(animate);

    let gui;
    if (process.env.NODE_ENV === "development") {
      window.__gardenPoster = () => {
        renderer.setPixelRatio(1); renderer.setSize(800, 800);
        const posterCamera = new THREE.OrthographicCamera(-2.0, 2.8, 2.65, -2.15, 0.1, 60);
        posterCamera.position.z = 12;
        const position = rig.position.clone(); rig.position.set(0, 0, 0);
        hemi.intensity = 2.2; key.intensity = p.dayKey; key.color.copy(day); lamp.intensity = 0; renderer.toneMappingExposure = p.dayExposure;
        rotor.rotation.z = 0;
        renderer.render(scene, posterCamera);
        const data = renderer.domElement.toDataURL("image/png");
        rig.position.copy(position); renderer.setPixelRatio(Math.min(devicePixelRatio,p.dpr)); resize();
        return data;
      };
      // Export the same authored geometry for reuse in Blender or other scenes.
      window.__exportGardenWheel = async () => {
        const {GLTFExporter} = await import("three/addons/exporters/GLTFExporter.js");
        const model = new THREE.Group(); model.name = "JIN_Waterwheel";
        for (const child of root.children) if (child.name === "Rotor" || child.name === "Fixed_frame_and_flume") model.add(child.clone());
        model.getObjectByName("Rotor").rotation.z = 0;
        const duration = 60 / p.rpm, times = [], values = [];
        for (let i = 0; i <= 4; i++) {
          times.push(duration * i / 4);
          values.push(...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI * i / 2).toArray());
        }
        const clip = new THREE.AnimationClip("Waterwheel_cycle", duration, [new THREE.QuaternionKeyframeTrack("Rotor.quaternion", times, values)]);
        return new GLTFExporter().parseAsync(model, {binary: true, animations: [clip]});
      };
      if (new URLSearchParams(location.search).has("garden-debug")) {
        import("lil-gui").then(({default: GUI}) => {
          if (disposed) return;
          gui = new GUI({title: "Garden · model & composition"});
          for (const [name, value] of Object.entries(p)) {
            if (typeof value === "number") gui.add(p, name).onChange(resize);
          }
        });
      }
    }
    return () => {
      disposed = true; cancelAnimationFrame(frame); ro.disconnect(); gui?.destroy();
      motion.removeEventListener("change", onMotion); document.removeEventListener("visibilitychange", onVisibility);
      renderer.domElement.removeEventListener("webglcontextlost", lose);
      disposeObject(scene); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
      if (process.env.NODE_ENV === "development") {delete window.__exportGardenWheel; delete window.__gardenPoster;}
    };
  }, [params, onReady, onUnavailable, layoutRef]);
  return <div ref={host} className="garden-webgl" aria-hidden="true" />;
}
