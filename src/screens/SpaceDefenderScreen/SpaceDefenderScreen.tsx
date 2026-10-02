import { useCallback, useState } from "react";
import SpaceDefender from "../../components/SpaceDefender";
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
  const status = !gameActive ? "PAUSED" : engaged ? "ENGAGED" : "READY";

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
          <span>EXPERIMENT / 06</span>
          <span>INTERACTIVE SYSTEM · S/F/Y</span>
        </div>
        <div className="spaceDefenderIntroduction">
          <h1 id="space-defender-title">SPACE <span>DEFENDER.</span></h1>
          <p>A playable corner of the build. Move to engage; the ship fires on its own.</p>
        </div>
      </header>

      <div className="spaceDefenderArena">
        <div className="spaceDefenderArenaLabel" aria-hidden="true">
          <span>LIVE TARGET / WAVE {String(wave).padStart(2, "0")}</span>
          <span>01 — DESTRUCTIBLE FIELD</span>
        </div>
        <SpaceDefender isOpen={gameActive} onEngage={onEngage} onHit={onHit} onWave={onWave} />
      </div>

      <footer className="spaceDefenderFooter">
        <span className="spaceDefenderStatus"><i aria-hidden="true" />SYSTEM {status}</span>
        <span className="spaceDefenderInstruction">{engaged ? "MOUSE / TOUCH" : "MOVE TO ENGAGE"} <span aria-hidden="true">→</span> AUTO FIRE</span>
        <span className="spaceDefenderHits">HITS <strong>{String(hits).padStart(3, "0")}</strong></span>
      </footer>
    </section>
  );
}
