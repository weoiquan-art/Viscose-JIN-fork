"use client";
import {useCallback, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import GardenGate from "./GardenGate";
import {PROJECTS} from "./ring/catalog";

const Carousel = dynamic(() => import("./Carousel"), {loading: () => <div className="studio-loading" role="status">正在打开作品世界…</div>});
const isProject = () => PROJECTS.some((p) => location.hash === `#${p.slug}`);

export default function StudioExperience() {
  const [inside, setInside] = useState(false);
  const [night, setNight] = useState(false);
  useEffect(() => {
    const system = matchMedia("(prefers-color-scheme: dark)");
    const saved = () => {try {return localStorage.getItem("jin-theme");} catch {return null;}};
    const syncTheme = () => {
      const value = saved();
      setNight(value === "night" || (value !== "day" && system.matches));
    };
    const syncRoute = () => setInside(isProject());
    queueMicrotask(() => {syncTheme(); syncRoute();});
    window.addEventListener("popstate", syncRoute); window.addEventListener("hashchange", syncRoute);
    window.addEventListener("storage", syncTheme); system.addEventListener("change", syncTheme);
    return () => {window.removeEventListener("popstate", syncRoute); window.removeEventListener("hashchange", syncRoute); window.removeEventListener("storage", syncTheme); system.removeEventListener("change", syncTheme);};
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = night ? "night" : "day";
    window.dispatchEvent(new Event("jin-theme-change"));
  }, [night]);
  const toggle = useCallback(() => setNight((old) => {
    const next = !old;
    try {localStorage.setItem("jin-theme", next ? "night" : "day");} catch { /* Ephemeral theme still works. */ }
    return next;
  }), []);
  const enter = useCallback(() => {
    history.pushState({jinSurface: "gallery"}, "", `#${PROJECTS[0].slug}`);
    setInside(true);
    requestAnimationFrame(() => document.getElementById("garden-return")?.focus());
  }, []);
  const returnToGarden = () => {
    history.pushState({jinSurface: "garden"}, "", location.pathname + location.search);
    setInside(false);
    requestAnimationFrame(() => document.querySelector(".garden-enter")?.focus());
  };
  return <>
    {inside ? <Carousel /> : <GardenGate night={night} onToggle={toggle} onEnter={enter} />}
    <nav className={`site-controls${inside ? " in-studio" : " in-garden"}`} aria-label="场景与外观">
      {inside && <button id="garden-return" type="button" onClick={returnToGarden}>回到花园</button>}
      <button type="button" className="theme-toggle" aria-label={night ? "切换到白天" : "切换到夜晚"} aria-pressed={night} onClick={toggle}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          {night ? <path d="M20.4 13.1A8.6 8.6 0 0 1 10.9 3.6 8.6 8.6 0 1 0 20.4 13.1Z" /> : <><circle cx="12" cy="12" r="3.8" /><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4.2 4.2l2.1 2.1m11.4 11.4 2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></>}
        </svg><span>{night ? "夜晚" : "白天"}</span>
      </button>
    </nav>
  </>;
}
