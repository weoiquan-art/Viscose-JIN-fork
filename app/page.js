import StudioExperience from "@/components/StudioExperience";
import { ProjectFallback } from "@/components/ProjectUI";

export default function Page() {
  return <>
    <StudioExperience />
    <noscript>
      <style>{`.garden-gate,.site-controls{display:none!important}.nojs-world{position:fixed;inset:0;overflow:auto}.nojs-garden{height:100dvh;display:grid;place-items:center;background:linear-gradient(#0002,#0005),url(/garden/day.webp) center/cover}.nojs-garden a{padding:16px 24px;color:white;background:#162b25d9}.nojs-world .project-fallback{position:relative;overflow:visible}`}</style>
      <div className="nojs-world"><div className="nojs-garden"><a href="#catalog">JIN Studio · 进入作品世界 ↓</a></div><div id="catalog"><ProjectFallback hidden={false} /></div></div>
    </noscript>
  </>;
}
