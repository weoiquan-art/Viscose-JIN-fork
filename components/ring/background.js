// The optional bg path can override the image already used by a card.
// Film cards reuse their poster; cards without art stay on the paper colour.
export const backgroundForProject = (project) =>
  project && !project.pending && project.slug !== "contact"
    ? project.bg ?? project.image ?? project.poster ?? `/${project.file}`
    : null;
