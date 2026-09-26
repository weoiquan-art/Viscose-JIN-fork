"use client";
/* eslint-disable @next/next/no-img-element */
import {useCallback, useEffect, useRef, useState} from "react";
import GardenWheel from "./garden/GardenWheel";
import {gardenParams} from "./ring/params";
import {gardenLayout} from "./garden/layout";

export default function GardenGate({night, onToggle, onEnter}) {
  const [params] = useState(gardenParams);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const layoutRef = useRef(null), exitTimer = useRef(null);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => setUnavailable(true), []);
  useEffect(() => () => clearTimeout(exitTimer.current), []);
  useEffect(() => {
    const el = layoutRef.current;
    const fit = () => {
      const {vars} = gardenLayout(el.clientWidth, el.clientHeight, params);
      for (const [name, value] of Object.entries(vars)) el.style.setProperty(name, `${value}px`);
    };
    const observer = new ResizeObserver(fit); observer.observe(el); fit();
    return () => observer.disconnect();
  }, [params]);
  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) onEnter();
    else exitTimer.current = setTimeout(onEnter, params.exitTime * 1000);
  };
  const changeLabel = night ? "切换到白天" : "切换到夜晚";
  return <section ref={layoutRef} aria-label="JIN Studio 花园入口"
    className={`garden-gate${night ? " is-night" : ""}${leaving ? " is-leaving" : ""}${unavailable ? " is-static" : ""}`}
    style={{"--garden-transition": `${params.transition}s`, "--garden-exit": `${params.exitTime}s`}}>
    <div className="garden-scene" aria-hidden="true">
      <div className="garden-plate">
        <img src="/garden/day.webp" width="1672" height="941" alt="" fetchPriority="high" />
        <img className="garden-night" src="/garden/night.webp" width="1672" height="941" alt="" loading="eager" />
      </div>
      <div className="garden-shade" />
      {!unavailable && <GardenWheel params={params} night={night} paused={paused} leaving={leaving} onReady={onReady} onUnavailable={onUnavailable} layoutRef={layoutRef} />}
      {unavailable && <img className="garden-static-wheel" src="/garden/waterwheel-poster.png" alt="" />}
      <div className="garden-lamp-glow" />
      <div className={`garden-motes${paused ? " is-paused" : ""}`}>
        {Array.from({length: 14}, (_, i) => <i key={i} style={{"--i": i, left: `${12 + (i * 31 % 77)}%`, top: `${42 + (i * 17 % 40)}%`}} />)}
      </div>
    </div>
    <header className="garden-brand"><span>JIN STUDIO</span><span className="garden-brand-note">IMAGINATION, IN MOTION</span></header>
    <button type="button" className="garden-lamp-target" aria-label={changeLabel} aria-pressed={night} onClick={onToggle}><span className="sr-only">{changeLabel}</span></button>
    <button type="button" className="garden-wheel-target" aria-label="点击水车，进入 JIN Studio" disabled={leaving} onClick={enter}>
      <span className="garden-wheel-halo" aria-hidden="true" />
    </button>
    <div className="garden-caption">
      <p className="garden-eyebrow">A LITTLE WORLD BY JIN</p>
      <h1>故事，从这里流转。</h1>
      <button type="button" className="garden-enter" onClick={enter} disabled={leaving}>进入作品世界 <span aria-hidden="true">↗</span></button>
      <p className="garden-instruction">点击水车进入 · 轻触路灯，切换昼夜</p>
    </div>
    <div className="garden-footnote"><span>{night ? "月色下的花园" : "阳光里的花园"}</span>
      {ready && !unavailable && <button type="button" onClick={() => setPaused((v) => !v)} aria-pressed={paused}>{paused ? "继续水车" : "暂停动态"}</button>}
    </div>
    <div className="garden-entry-ripple" aria-hidden="true" />
  </section>;
}
