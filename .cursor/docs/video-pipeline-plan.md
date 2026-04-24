# Video Pipeline Plan

## Architecture

```
content/scenarios/<slug>/content.json  →  Remotion composition  →  MP4
                                              ↑
                                     video/src/FableVideo/
```

Remotion lives in `video/` alongside `site/`. Reads the same `content/` directory.

## Data Flow

Fable `content.json` already has everything video needs:

| Fable field | Video layer |
|---|---|
| `scenes[].action` | Visual narration text (on-screen, animated in) |
| `scenes[].dialogue[].line` | Speech bubbles / text cards per character |
| `scenes[].dialogue[].character` | Character color + positioning (left/right) |
| `scenes[].subtext` | Optional narrator overlay (reveal version) |
| `meta.characters[]` | Character intro cards, color assignment |
| `setup` | Opening scene text |
| `twist.content` | Dramatic reveal scene |
| `moral_question` | Closing card |

## Output Formats

| Format | Aspect | Duration target | Use case |
|---|---|---|---|
| `reel` | 9:16 (1080x1920) | 15-60s per scene | TikTok, Reels, Shorts |
| `full` | 16:9 (1920x1080) | 2-4 min total | YouTube, blog embed |

## Scene Composition (per scene)

```
[0.0s - 0.5s]  Scene number fade in (uppercase, tracking-wide)
[0.5s - 3.0s]  Action text — typewriter or fade-in-up, serif font
[3.0s - end]   Dialogue sequence:
                  - Character name + bubble slide in from left/right
                  - 2-3s per dialogue line
                  - Color-coded per character (same colors as FableRenderer)
[last 1s]      Fade to black transition
```

### Special scenes

**Setup:** Same as regular scene but with title card first (title + subtitle, 3s).
**Twist:** Full-screen italic text, slower pacing, dramatic pause.
**Moral question:** Dark background, question text center-screen, hold 5s.

## Character Visuals

Phase 1 (text-only): Characters are color-coded name labels + speech bubbles. No illustrations.
Phase 2 (future): Swap in illustrated character avatars. The composition accepts an optional `avatar` URL per character in meta.

## Remotion Project Structure

```
video/
├── package.json
├── remotion.config.ts
├── src/
│   ├── Root.tsx              # Remotion entry, registers compositions
│   ├── FableVideo.tsx        # Main composition — orchestrates all scenes
│   ├── sequences/
│   │   ├── TitleCard.tsx     # Title + subtitle intro
│   │   ├── SetupScene.tsx    # Renders setup text
│   │   ├── DialogueScene.tsx # Action + dialogue bubbles for one scene
│   │   ├── TwistScene.tsx    # The dramatic twist
│   │   └── MoralCard.tsx     # Closing question
│   ├── components/
│   │   ├── CharacterBubble.tsx
│   │   ├── AnimatedText.tsx
│   │   └── SceneTransition.tsx
│   └── lib/
│       ├── loadFable.ts      # Reads content.json + meta.json for a slug
│       ├── timing.ts         # Frame/duration calculators per scene
│       └── colors.ts         # Character color palette (matches site)
```

## Render Script

```bash
# Render a reel (9:16) for a specific fable
node scripts/render-video.js --slug the-watering-hole --format reel

# Render full video (16:9)
node scripts/render-video.js --slug the-watering-hole --format full

# Render a single scene as a reel clip
node scripts/render-video.js --slug the-watering-hole --format reel --scene 2

# Preview in Remotion Studio
cd video && npm run dev
```

The script:
1. Reads `content/scenarios/<slug>/meta.json` + `content.json`
2. Passes data as Remotion input props
3. Calls `npx remotion render` with format-specific config (dimensions, fps)
4. Outputs to `video/out/<slug>-<format>.mp4`

## Timing Calculation

```
title_card:      3s (90 frames @ 30fps)
setup:           ~word_count / 3 seconds (reading speed)
per_scene:
  action:        ~word_count / 3 seconds
  per_dialogue:  max(2s, word_count / 4 seconds)
  transition:    1s
twist:           ~word_count / 2.5 seconds (slower)
moral_question:  5s
```

Total auto-calculated from content. Override with `--duration` flag.

## Dependencies

- `remotion` + `@remotion/cli` + `@remotion/bundler`
- `@remotion/renderer` (for programmatic render)
- No external TTS/audio in Phase 1 (text-only videos, background music optional via static asset)

## Future Extensions

- **TTS layer:** Plug in Kokoro or ElevenLabs for narration. Each `action` field becomes narrator audio; each `dialogue[].line` becomes character voice.
- **Illustrations:** Add `avatar` field to `meta.characters[]`. Compositions swap text labels for images.
- **Background music:** Drop MP3 in `video/public/music/`. Script accepts `--music calm|dramatic|playful`.
- **Auto-captions:** Whisper.cpp on the TTS output, burned into video.
- **Batch render:** `render-video.js --all --format reel` renders every published fable.
- **Short-Video-Maker integration:** Alternative pipeline for quick stock-footage-based videos. Feed fable text to its REST API for a different visual style.
