// The single source of truth for atlas cells, ring order, index and permalinks.
// Keep unprovided material explicitly marked; never substitute sample artwork.
export const PROJECTS = [
  {
    slug: "nuonuo", file: "media/nuonuo.png", image: "/media/nuonuo.png",
    name: "糯糯", type: "Character", year: "",
    description: "糯糯的角色形象。", fit: "contain",
  },
  {
    slug: "phoebe", file: "media/phoebe.png", image: "/media/phoebe.png",
    name: "菲比", type: "Character", year: "",
    description: "菲比的角色形象。", fit: "contain",
  },
  {
    slug: "sera-chibi", file: "media/sera-chibi.png", image: "/media/sera-chibi.png",
    name: "Sera · Q 版", type: "Character", year: "",
    description: "Sera 的 Q 版角色形象。", fit: "contain",
  },
  {
    slug: "sera-portrait", file: "media/sera-portrait.png", image: "/media/sera-portrait.png",
    name: "Sera · 肖像", type: "Identity portrait", year: "",
    description: "Sera 的拟真身份肖像。", fit: "contain",
  },
  {
    slug: "sera-costume", file: "media/costume-pending.svg",
    name: "Sera · 服装设定", type: "Character sheet", year: "",
    description: "服装设定三视图待提供。", pending: true,
  },
  {
    slug: "trio-film", file: "media/trio-poster.jpg", poster: "/media/trio-poster.jpg",
    video: "/media/trio-film.mp4", name: "三小只影片", type: "Film · regular", year: "",
    description: "菲比、糯糯与 Sera 的短片。", aspect: "portrait", fit: "contain",
  },
  {
    slug: "homeworld-film", file: "media/homeworld-poster.jpg", poster: "/media/homeworld-poster.jpg",
    video: "/media/homeworld-film.mp4", name: "Sera《家乡》", type: "Film · featured", year: "",
    description: "25 秒非正史试片。", featured: true,
  },
  {
    slug: "social-01", file: "media/trio-poster.jpg", poster: "/media/trio-poster.jpg",
    name: "三小只 · Facebook", type: "Social film", year: "",
    description: "前往 Facebook 查看三小只影片。封面待补，暂用本地影片静帧。",
    external: { platform: "Facebook", url: "https://fb.watch/v/3U81sYFlV/" },
    coverPending: true, fit: "contain",
  },
  {
    slug: "contact", file: "media/contact.svg", name: "Contact", type: "Contact", year: "",
    description: "联系 JIN Studio。",
  },
];

export const IMAGE_FILES = PROJECTS.map((project) => project.file);
export const CONTACT_LINKS = [
  { label: "Email", href: "mailto:jinmyaigc@gmail.com", text: "jinmyaigc@gmail.com" },
  { label: "Instagram", href: "https://www.instagram.com/jin082714/", text: "@jin082714" },
  { label: "TikTok", href: "https://www.tiktok.com/@jin08271", text: "@jin08271" },
  { label: "GitHub", href: "https://github.com/weoiquan-art", text: "@weoiquan-art" },
  { label: "Courses", href: "https://weoiquan-art.github.io/jinmyaigc/", text: "JIN MY AIGC" },
];
