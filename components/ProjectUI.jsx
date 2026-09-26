"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { CONTACT_LINKS } from "./ring/projects";
import { PROJECTS } from "./ring/catalog";
import { backgroundForProject } from "./ring/background";

const outbound = (href) =>
  href.startsWith("http")
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

const galleryItem = (item) => (typeof item === "string" ? { src: item } : item);

function StagePage({ project, index, actionRef, onOpen, leaving, onGone }) {
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      video?.pause();
      if (video) video.currentTime = 0;
    };
  }, [project.slug]);

  const media =
    project.layout === "film" ? (
      leaving ? (
        <img src={project.poster} alt="" />
      ) : (
        <video
          ref={videoRef}
          src={project.video}
          poster={project.poster}
          controls
          playsInline
          preload="metadata"
          aria-label={project.name}
          onKeyDown={(event) => {
            if (event.key !== "Escape") return;
            event.preventDefault();
            event.currentTarget.pause();
            event.currentTarget.currentTime = 0;
            actionRef.current?.focus();
          }}
        />
      )
    ) : project.layout === "contact" ? (
      <div className="contact-links">
        {CONTACT_LINKS.map(({ label, href, text }) => (
          <a key={label} href={href} {...outbound(href)}>
            {label} <span>{text} ↗</span>
          </a>
        ))}
      </div>
    ) : project.layout === "dossier" && project.facts ? (
      <div className="stage-dossier">
        {project.image && <img src={project.image} alt={project.name} />}
        <dl>
          {Object.entries(project.facts).map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    ) : ["sheet", "process", "scene"].includes(project.layout) &&
      project.gallery?.length ? (
      <div className={`stage-gallery stage-gallery--${project.layout}`}>
        {project.gallery.map((entry, i) => {
          const item = galleryItem(entry);
          return (
            <figure key={`${item.src}-${i}`}>
              <img
                src={item.src}
                alt={item.alt ?? `${project.name} ${i + 1}`}
                loading="lazy"
              />
              {item.caption && <figcaption>{item.caption}</figcaption>}
            </figure>
          );
        })}
      </div>
    ) : (
      <img
        src={project.image ?? project.poster ?? `/${project.file}`}
        alt={project.name}
        loading="lazy"
      />
    );

  return (
    <div
      className={`stage-page ${leaving ? "stage-page--leaving" : "stage-page--entering"}`}
      aria-hidden={leaving}
      inert={leaving}
      onAnimationEnd={leaving ? onGone : undefined}
    >
      <div className="stage-heading">
        <p className="stage-kicker">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(PROJECTS.length).padStart(2, "0")} · {project.type}
          {project.featured ? " · 示范片" : ""}
        </p>
        <h1>{project.name}</h1>
      </div>
      <div
        className={`stage-media stage-media--${project.layout}${project.aspect === "portrait" ? " stage-media--portrait" : ""}`}
      >
        {media}
        {project.layout === "social" && (
          <span className="stage-platform">{project.external?.platform}</span>
        )}
      </div>
      <div className="stage-footer">
        <p>{project.description}</p>
        {!leaving && project.external ? (
          project.external.url ? (
            <a
              ref={actionRef}
              className="project-action"
              href={project.external.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on {project.external.platform} ↗
            </a>
          ) : (
            <span className="project-pending">原帖链接待提供</span>
          )
        ) : !leaving &&
          project.layout !== "contact" &&
          (project.image || project.video) ? (
          <button
            ref={actionRef}
            className="project-action"
            type="button"
            onClick={onOpen}
          >
            {project.video ? "影院模式 ↗" : "查看全图 ↗"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function ProjectStage({ project, index, actionRef, onOpen }) {
  const [view, setView] = useState({ current: project, previous: null, index });
  if (project && project.slug !== view.current?.slug) {
    setView({
      current: project,
      previous: view.current,
      index,
      previousIndex: view.index,
    });
  }
  return (
    <section className="project-stage" aria-label="作品内容" aria-live="off">
      {view.previous && (
        <StagePage
          key={`old-${view.previous.slug}`}
          project={view.previous}
          index={view.previousIndex}
          leaving
          onGone={() =>
            setView((v) =>
              v.previous?.slug === view.previous.slug
                ? { ...v, previous: null }
                : v,
            )
          }
        />
      )}
      {view.current && (
        <StagePage
          key={view.current.slug}
          project={view.current}
          index={view.index}
          actionRef={actionRef}
          onOpen={onOpen}
        />
      )}
    </section>
  );
}

export function BackgroundPreview({ project, enabled }) {
  const videoRef = useRef(null);
  const next = enabled && project?.layout === "film" ? project.video : null;
  const [view, setView] = useState({
    target: next,
    src: next,
    poster: project?.poster,
    visible: Boolean(next),
  });
  if (next !== view.target) {
    setView({
      target: next,
      src: next ?? view.src,
      poster: next ? project.poster : view.poster,
      visible: Boolean(next),
    });
  }
  useEffect(() => {
    const video = videoRef.current;
    if (!view.visible) {
      video?.pause();
      if (video) video.currentTime = 0;
    }
    return () => {
      video?.pause();
      if (video) video.currentTime = 0;
    };
  }, [view.visible, view.src]);
  if (!view.src) return null;
  return (
    <video
      key={view.src}
      ref={videoRef}
      className={`backdrop-video ${view.visible ? "is-visible" : "is-leaving"}`}
      src={view.src}
      poster={view.poster}
      muted
      autoPlay
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      onAnimationEnd={() => {
        if (!view.visible)
          setView((v) => (v.visible ? v : { ...v, src: null }));
      }}
    />
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
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll(
        "button, a, video[controls]",
      );
      if (!nodes?.length) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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

  if (!project || project.pending || (!project.image && !project.video))
    return null;
  return (
    <div
      className="lightbox-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="lightbox-panel"
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        tabIndex={-1}
      >
        <div className="lightbox-heading">
          <span>{project.name}</span>
          <button type="button" onClick={onClose} aria-label="关闭">
            关闭 ×
          </button>
        </div>
        {project.video ? (
          <video
            ref={videoRef}
            className={
              project.aspect === "portrait" ? "film-portrait" : "film-landscape"
            }
            src={project.video}
            poster={project.poster}
            controls
            playsInline
            preload="metadata"
            aria-label={project.name}
          />
        ) : (
          <img
            className="lightbox-image"
            src={project.image}
            alt={project.name}
          />
        )}
      </div>
    </div>
  );
}

export function ProjectFallback({ hidden }) {
  return (
    <main className="project-fallback" hidden={hidden}>
      <header>
        <img src="/brand/raven.svg" alt="" />
        <div>
          <p>JIN Studio</p>
          <h1>作品目录</h1>
        </div>
      </header>
      <p className="fallback-intro">选择作品查看图像、影片或原始链接。</p>
      <div className="fallback-grid">
        {PROJECTS.map((p, i) => {
          const background = backgroundForProject(p);
          return (
            <article
              id={p.slug}
              key={p.slug}
              style={{
                backgroundImage: background
                  ? `linear-gradient(rgb(243 237 230 / 70%), rgb(243 237 230 / 70%)), url("${background}")`
                  : undefined,
              }}
            >
              <img
                src={`/${p.file}`}
                alt={p.pending ? "服装三视图待提供" : p.name}
              />
              <div>
                <small>
                  {String(i + 1).padStart(2, "0")} / {p.type}
                </small>
                <h2>{p.name}</h2>
                <p>{p.description}</p>
                {p.external ? (
                  <a
                    href={p.external.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch on {p.external.platform} ↗
                  </a>
                ) : p.video ? (
                  <a href={p.video}>Play film ↗</a>
                ) : p.image ? (
                  <a href={p.image}>Full view ↗</a>
                ) : p.slug === "contact" ? (
                  <div className="fallback-links">
                    {CONTACT_LINKS.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        {...outbound(link.href)}
                      >
                        {link.label}: {link.text} ↗
                      </a>
                    ))}
                  </div>
                ) : (
                  <span>素材待提供</span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
