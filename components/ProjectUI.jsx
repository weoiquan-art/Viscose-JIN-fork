"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";
import { CONTACT_LINKS, PROJECTS } from "./ring/projects";
import { backgroundForProject } from "./ring/background";

const outbound = (href) => href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};

export function ProjectDetails({ project, index, actionRef, onOpen }) {
  if (!project) return null;
  return (
    <section className="project-details" key={project.slug} aria-label={`${project.name} 资讯`}>
      <p className="project-kicker">{String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}{project.featured ? " · 示范片" : ""}</p>
      <p className="project-description">{project.description}</p>
      {project.slug === "contact" ? (
        <div className="contact-links">
          {CONTACT_LINKS.map(({ label, href, text }) => <a key={label} href={href} {...outbound(href)}>{label} <span>{text} ↗</span></a>)}
        </div>
      ) : project.pending ? <span className="project-pending">素材待提供</span> : project.external ? (
        <a ref={actionRef} className="project-action" href={project.external.url} target="_blank" rel="noopener noreferrer">Watch on {project.external.platform} ↗</a>
      ) : (
        <button ref={actionRef} className="project-action" type="button" onClick={onOpen}>{project.video ? "Play film ↗" : "Full view ↗"}</button>
      )}
    </section>
  );
}

export function ProjectLightbox({ project, onClose, returnFocusRef }) {
  const panelRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!project) return;
    const previousOverflow = document.body.style.overflow;
    const video = videoRef.current;
    const returnFocus = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const key = (event) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll("button, a, video[controls]");
      if (!nodes?.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      video?.pause();
      if (video) video.currentTime = 0;
      document.body.style.overflow = previousOverflow;
      returnFocus?.focus();
    };
  }, [project, onClose, returnFocusRef]);

  if (!project || project.pending || (!project.image && !project.video)) return null;
  return (
    <div className="lightbox-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={panelRef} className="lightbox-panel" role="dialog" aria-modal="true" aria-label={project.name} tabIndex={-1}>
        <div className="lightbox-heading"><span>{project.name}</span><button type="button" onClick={onClose} aria-label="关闭">关闭 ×</button></div>
        {project.video ? (
          <video ref={videoRef} className={project.aspect === "portrait" ? "film-portrait" : "film-landscape"} src={project.video} poster={project.poster} controls playsInline preload="metadata" aria-label={project.name} />
        ) : <img className="lightbox-image" src={project.image} alt={project.name} />}
      </div>
    </div>
  );
}

export function ProjectFallback({ hidden }) {
  return (
    <main className="project-fallback" hidden={hidden}>
      <header><img src="/brand/raven.svg" alt="" /><div><p>JIN Studio</p><h1>作品目录</h1></div></header>
      <p className="fallback-intro">选择作品查看图像、影片或原始链接。</p>
      <div className="fallback-grid">
        {PROJECTS.map((p, i) => {
          const background = backgroundForProject(p);
          return <article
            id={p.slug}
            key={p.slug}
            style={{ backgroundImage: background ? `linear-gradient(rgb(243 237 230 / 70%), rgb(243 237 230 / 70%)), url("${background}")` : undefined }}
          >
            <img src={`/${p.file}`} alt={p.pending ? "服装三视图待提供" : p.name} />
            <div><small>{String(i + 1).padStart(2, "0")} / {p.type}</small><h2>{p.name}</h2><p>{p.description}</p>
              {p.external ? <a href={p.external.url} target="_blank" rel="noopener noreferrer">Watch on {p.external.platform} ↗</a>
                : p.video ? <a href={p.video}>Play film ↗</a>
                  : p.image ? <a href={p.image}>Full view ↗</a>
                    : p.slug === "contact" ? <div className="fallback-links">{CONTACT_LINKS.map((link) => <a key={link.label} href={link.href} {...outbound(link.href)}>{link.label}: {link.text} ↗</a>)}</div>
                      : <span>素材待提供</span>}
            </div>
          </article>;
        })}
      </div>
    </main>
  );
}
