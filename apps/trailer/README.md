# @zupy/trailer

A 33-second, 1080p60 trailer for zupy, built from the real components. This package is temporary: it lives on its own branch so the video can be rendered and exported.

Every frame is a pure function of time (`src/timeline.ts`). The soundtrack is synthesized from scratch (`scripts/music.ts`) at 128 BPM. It reads the same cue beats as the scenes, so each pop, press and whoosh lands on its sound.

```bash
bun run --cwd apps/trailer dev      # preview with sound at http://localhost:3100 (space to play)
bun run --cwd apps/trailer music    # regenerate public/bgm.wav only
bun run --cwd apps/trailer render   # out/zupy-trailer.mp4 (needs ffmpeg)
```

`render --stills 120,900` saves single frames to `out/stills`. Set `CHROMIUM_PATH` if Playwright's own browser isn't installed.
