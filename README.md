# Jisenkoku: The Black Wing
**次元戦乱 黒翼** · Mission 01: *Freedom Fighters*

An offline browser shoot-'em-up from Brackuro Studios. Three pilots share one formation and switch dimensions on the fly. Fly into bullets that match your color to cancel them, and dodge every other color.

**Play in the browser:** https://nytmaer.github.io/jisenkoku-black-wing/ (rebuilt and redeployed automatically on every push to `main`)

## Quick start

Requires [Node.js](https://nodejs.org) 18 or newer. There are no npm dependencies; Three.js r169 is vendored in `vendor/`.

```sh
npm run build
```

Then open **dist/index.html** in Chrome or Edge. It's a single self-contained file that runs offline with no server. The first launch takes a few seconds while it prepares the nine embedded fighter images.

`dist/` is generated and not committed. `.github/workflows/pages.yml` builds it in CI and publishes it to GitHub Pages.

## Controls

| Action | Keyboard | Controller | Touch |
| --- | --- | --- | --- |
| Move | WASD / arrows | Left stick / d-pad | Drag the battlefield |
| Kevo / red (Revo Red) | 1 | X | Tap Kevo or swipe the lever |
| M. / blue (Beta Blue) | 2 | B | Tap M. or swipe the lever |
| Daiga / white (Wendigo White) | 3 | A | Tap Daiga or swipe the lever |
| Cycle pilot | | LB | |
| Focus (half speed) | Hold Shift / Space | Hold RB / RT | |
| Pause | Esc / P | Start / Back | Pause button |
| Launch, confirm, skip opening | Enter | A / Start | Tap |

Firing is automatic. Controllers rumble on hits, heavy kills, pilot shifts, and the boss's death sequence.

## Development

| Command | What it does |
| --- | --- |
| `npm run build` | Bundles everything into `dist/index.html` |
| `npm test` | Runs the deterministic simulation checks |
| `npm run dev` | Builds, then serves `dist/` at http://localhost:4173 |

QA fixtures (disabled in a normal launch): `?qa=art`, `?qa=title`, `?qa=mixed`, `?qa=carrier`, `?qa=boss`, `?qa=density`.

### Layout

| Path | Contents |
| --- | --- |
| `core.js` | Game simulation: pilots, authored stage `SCRIPT`, enemies, boss, scoring. No DOM. |
| `render.js` | WebGL renderer (Three.js) |
| `software.js` | Canvas 2D fallback renderer |
| `assets.js` | Fighter art roster, background matting, sprite anchors |
| `audio.js` | Synthesized sound and music |
| `main.js` | Input (keyboard, pointer, touch, gamepad), HUD, dialogue, game loop |
| `template.html` | Page shell and styles; the bundle is injected at `<!--BUNDLE-->` |
| `build.cjs` | Single-file bundler |
| `tests.cjs` | Simulation tests |
| `assets/` | Source fighter PNGs, embedded at build time |
| `AUDIO-MANIFEST.md` | Music and SFX checklist for the audio pass |
| `HISTORY-V1.md` | Version 1 checkback |

## Version 2.1: polish pass

- **Pilots and ships.** Kevo flies Revo Red (red), M. flies Beta Blue (blue), and Daiga flies Wendigo White (white). Each pilot cancels bullets of their ship's color. Bullet shapes follow color: red six-point star, blue orb, white needle, orange diamond (dodge only).
- **Authored stage.** `SCRIPT` in `core.js` replaces the procedural wave formula with 54 hand-timed waves: curved swoops, drop-and-hold formations, and side sweeps. Runs are deterministic. Heavies retreat upward, small craft peel off to the sides, enemies face their direction of travel, and nothing fires from off screen or from below the player.
- **Bullet readability.** Enemy bullets draw above everything as four layers: glow, dark rim, colored body, white core. The visible body is 1.55× the damage radius, and new bullets pop in from 40% size. Player shots are translucent and draw under enemy fire.
- **Feedback.** Enemies and the boss flash on hit. Kills spawn shockwave rings and score popups. Grazes throw sparks.
- **Bullet cancel to score.** Destroying a heavy, a boss turret, or a boss phase turns the relevant bullets into gold items that fly to the player.
- **Boss finale.** Phase changes get a brief slowdown. The boss death runs a 2.6-second chained-explosion sequence with slow motion before the clear.
- **Fairness.** Taking a hit erases bullets within 2.8 units of the hitbox.
- **Focus mode.** Hold Shift or Space (gamepad RB / RT) for half-speed flight with an enlarged hitbox marker.
- **Presentation.** Section banners carry Japanese headings (第一区画 出撃 …). The boss arrival shows a striped red WARNING band. The boss bar sits along the top edge. The results screen tallies max chain, grazes, kills, item bonus, hull bonus, and clear bonus.
- Added M. and Daiga radio cues for when blue and white enemies first appear.
- Full controller flow: d-pad, menus and restart, Start skips the opening, LB cycles pilots, rumble, and connect / disconnect handling.
- The build is now a Node script (`build.cjs`), so no Python is needed.

## Fighter art pass

This build integrates all nine supplied PNGs. Original uploads are retained unchanged in `assets/`. At startup, the game removes flat backgrounds, preserves enclosed armor panels, clears detached speckles, crops the visible silhouette, and prepares a shared texture for both renderers. Revo uses the alpha channel already present in its source.

| Supplied artwork | Current V2 assignment |
| --- | --- |
| Beta_Blue.png | M., blue shift state |
| Wendigo_White.png | Daiga, white shift state; brightened at load from its teal-gray paint |
| Revo_Red.png | Kevo, red shift state; green armor recolored to crimson at load |
| 3211c563-b201-4b4f-87ab-579848f408de.png | Allied support fighter in distant formations |
| 990e9330-82bc-48bb-b4bd-c3b8bfe9fd0e.png | Enemy lancer / dark interceptor |
| Neutral Drone.png | Enemy scout artwork for blue and white attack states |
| Red Drone.png | Enemy scout artwork for red attack state |
| DF_Buster_Jet.png | Enemy heavy fighter |
| df43fc7d-c31d-40aa-b0c1-cb7062a9ea0b.png | Enemy heavy fighter variant used for red attack state |

These faction assignments are implementation choices for this pass. They can be changed in `assets.js` without repainting the artwork. The filenames do not by themselves establish story canon or cancellation rules. Colored markers continue to identify each enemy's attack state.

Friendly noses point forward. Enemy fighters are rotated to face into the playfield. All three hero images use a shared 2.8-world-unit length and a common anchor while preserving their individual proportions. Kevo's broad wings, Wendigo's compact silhouette, and Revo's slender hull remain distinct. Continuous firing, bank animation, handoff movement, damage reaction, and cancel fields continue to work.

The WebGL path uses the supplied illustrations on transparent planes within the existing 3D battlefield. The software fallback uses the same prepared artwork. This is a sprite integration pass. The new illustrations have not been reconstructed as volumetric ship models. Parked aircraft on the carrier and the mission boss retain the Version 1 procedural models. Daiga's opening figure and the portrait placeholders also remain from Version 1; his standing position now aligns with Revo's cockpit.

## Validation

- All nine supplied images were decoded and inspected together against a checkerboard background.
- The transparency pass was corrected to preserve gray armor and clear the Red Drone's enclosed green background regions.
- The title formation and 390 × 844 portrait combat were inspected in the software renderer.
- Kevo / Beta Blue, M. / Wendigo White, and Daiga / Revo Red were selected in combat; the HUD updated to each fighter name.
- All nine existing simulation checks pass, including shifting, firing while moving, color cancellation, collisions, death / reset, the complete mission timeline, boss phases, turret destruction, and victory.
- The complete standalone JavaScript parses, and all nine PNGs are embedded in the HTML.

The V2 checks ran with WebGL disabled. In V2.1 the WebGL path was exercised in Chromium during the polish pass. Physical mobile multi-touch and real-controller tests remain open. Version 1's performance measurements are retained as historical observations in `validation-v1.json`; they are not Version 2 certification.
