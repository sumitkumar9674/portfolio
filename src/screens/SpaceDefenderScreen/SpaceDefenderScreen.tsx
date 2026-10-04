import { useCallback, useState } from "react";
import SpaceDefender from "../../components/SpaceDefender";
import { siteContent } from "../../content/siteContent";
import { useBlogsPage } from "../../hooks/useBlogsPage";
import "./SpaceDefenderScreen.css";

type SpaceDefenderScreenProps = {
  isActive: boolean;
  hasBeenActivated: boolean;
  isFirstOpen: boolean;
};

export default function SpaceDefenderScreen({
  isActive,
  hasBeenActivated,
  isFirstOpen,
}: SpaceDefenderScreenProps) {
  const [engaged, setEngaged] = useState(false);
  const [hits, setHits] = useState(0);
  const [wave, setWave] = useState(1);
  const showingBlogs = useBlogsPage();
  const gameActive = isActive && !showingBlogs;
  const onEngage = useCallback(() => setEngaged(true), []);
  const onHit = useCallback((count: number) => setHits((previous) => previous + count), []);
  const onWave = useCallback((next: number) => setWave(next), []);
  const status = !gameActive ? siteContent.spaceDefender.paused : engaged ? siteContent.spaceDefender.engaged : siteContent.spaceDefender.ready;

  return (
    <section
      className="spaceDefenderScreen"
      data-active={isActive}
      data-has-been-activated={hasBeenActivated}
      data-first-open={isFirstOpen}
      data-engaged={engaged}
      aria-hidden={!isActive}
      inert={!isActive}
      aria-labelledby="space-defender-title"
    >
      <header className="spaceDefenderHeader">
        <div className="spaceDefenderMeta">
          <span>{siteContent.spaceDefender.eyebrow}</span>
          <span>{siteContent.spaceDefender.meta}</span>
        </div>
        <div className="spaceDefenderIntroduction">
          <h1 id="space-defender-title">{siteContent.spaceDefender.titleFirst} <span>{siteContent.spaceDefender.titleSecond}</span></h1>
          <p>{siteContent.spaceDefender.introduction}</p>
        </div>
      </header>

      <div className="spaceDefenderArena">
        <div className="spaceDefenderArenaLabel" aria-hidden="true">
          <span>{siteContent.spaceDefender.targetPrefix}{String(wave).padStart(2, "0")}</span>
          <span>{siteContent.spaceDefender.field}</span>
        </div>
        <SpaceDefender isOpen={gameActive} onEngage={onEngage} onHit={onHit} onWave={onWave} />
      </div>

      <footer className="spaceDefenderFooter">
        <span className="spaceDefenderStatus"><i aria-hidden="true" />{siteContent.spaceDefender.system}{status}</span>
        <span className="spaceDefenderInstruction">{engaged ? siteContent.spaceDefender.mouseTouch : siteContent.spaceDefender.moveToEngage} <span aria-hidden="true">→</span> {siteContent.spaceDefender.autoFire}</span>
        <span className="spaceDefenderHits">{siteContent.spaceDefender.hits} <strong>{String(hits).padStart(3, "0")}</strong></span>
      </footer>
    </section>
  );
}
