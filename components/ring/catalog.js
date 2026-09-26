import { PROJECTS as SOURCE_PROJECTS } from "./projects";

// The source file remains the ring-order/content authority. An unavailable
// asset stays documented there, but does not become a navigable empty card.
export const PROJECTS = SOURCE_PROJECTS.filter(
  (project) => !project.pending,
).map((project) => ({
  ...project,
  layout:
    project.layout ??
    (project.external
      ? "social"
      : project.video
        ? "film"
        : project.slug === "contact"
          ? "contact"
          : "portrait"),
}));

export const IMAGE_FILES = PROJECTS.map((project) => project.file);
