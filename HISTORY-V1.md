> **Historical (Version 1).** Pilot colors have since changed: Kevo is now red (Revo Red), M. is blue (Beta Blue), and Daiga is white (Wendigo White). See README.md for current controls.

# Jisenkoku: Black Wing

**Mission 01: Freedom Fighters**

An offline HTML / JavaScript vertical slice based on Kenan Brack's brief, the supplied winged mecha drawing, and the *Variable Fighter A.B.OM* dialogue script. Original procedural fighters, enemies, battlefield, portraits, effects, and synthesized audio. The locally available Three.js r169 renderer is included under its MIT license.

## Launch

Open **Jisenkoku-Black-Wing.html** in a browser. Press **Launch Black Wing**. The file contains all executable code and assets. It makes no asset downloads, uses no CDN, and needs no installation or local server.

In the source project, open **dist/index.html**. A browser with WebGL 2 uses the 3D renderer. If graphics acceleration is unavailable, the game automatically uses a Canvas renderer with sprites rasterized from the same 3D models.

The authored escalation reaches the boss at 3:51. Defeating it and completing the exit dialogue typically makes the mission about five minutes, depending on accuracy and survival.

## Controls

| Action | Keyboard | Pointer / touch | Gamepad |
| --- | --- | --- | --- |
| Move | WASD / arrows | Drag the battlefield; movement is relative to your starting touch | Left stick |
| Kevo (V1: blue, now red) | 1 | Tap Kevo or swipe down-left on the lever | A |
| M. (V1: white, now blue) | 2 | Tap M. or swipe up on the lever | X |
| Daiga (V1: red, now white) | 3 | Tap Daiga or swipe down-right on the lever | B |
| Fire | Automatic | Automatic | Automatic |
| Pause | P / Esc | Pause button | Start |
| Skip opening | Enter during opening | Opening lasts eight seconds | — |

The colored ring cancels matching bullets. The small white center is your damage hitbox. Other colors and orange diamonds must be dodged. The two support fighters are visually present; they do not have independent damage hitboxes. Shifting instantly changes the active fighter, speed, weapon pattern, and cancellation color. No shift cooldown or firing interruption is imposed.

Touch flight and the shift lever capture separate pointer IDs. The lever uses an 18 CSS-pixel swipe threshold and three angular sectors. Haptic feedback is requested on supported devices.

## Checkback

### Implemented

- Responsive portrait and desktop gameplay with continuous fire, precise movement, and a fixed 120 Hz simulation.
- Three distinct fighter silhouettes and weapon patterns: Kevo's focused twin fire, M.'s spread, and Daiga's heavy twin cannons.
- Instant dimension handoffs, colored cancellation, grazes, cancel chains, score, six-point hull, and brief damage protection.
- Tap / swipe shift lever, keyboard, pointer, and gamepad input paths.
- Eight-second opening: brig escape setup, formation flight, Daiga standing above his cockpit, a simplified cockpit drop, system-ready cues, and IKUZE.
- Six timed encounter sections: flight, first dimensional pattern, alternating pressure, combined formations, carrier dive, and boss.
- Scouts, lancers, and heavy enemies with a 0.65-second attack anticipation window.
- Three-phase boss, two destructible turrets, mixed dimensional fans, neutral threats, destruction, and mission completion.
- Ocean, fleet, clouds, contrails, carrier fire and smoke, distant formations, banking, shift transitions, hit particles, and damage shake.
- Procedural portrait expressions and radio dialogue derived from the supplied script and brief.
- Original synthesized music and effect cues; mute control.
- Pause, automatic pause on focus loss, death, restart, and title return.
- Single-file offline delivery and an editable source project.

### Tested and working

Nine automated simulation checks pass:

1. All pilots can be selected during the opening; 100 immediate handoffs work without cooldown.
2. Movement and automatic fire continue through 100 repeated shifts.
3. Every matching color cancels; every mismatch and every orange contact damages correctly.
4. The cancellation radius exceeds the damage hitbox; a nearby wrong-color bullet can graze safely.
5. Damage protection, death, reset, pause, and resume behave correctly.
6. Keyboard bounds and pointer targets remain inside the flight area.
7. Enemies telegraph before firing.
8. The full timeline reaches every encounter phase and the boss.
9. Boss phase transitions, turret destruction, and victory resolve correctly.

Browser checks exercised the desktop launch screen, pointer movement, tap shifts, a lever swipe from Kevo to M., keyboard pilot selection, pause, and 390 × 844 portrait layouts. Screens were inspected for mixed-color combat, boss framing, and the carrier pass. A mobile radio overlap and a wrapping pilot label were corrected.

The complete inline JavaScript parses successfully. The playable document has no external script or asset references.

### Partially implemented

- Character portraits and Daiga's opening figure are original procedural placeholders. They establish the scene and expressions; final character artwork remains an art pass.
- The drawing influenced wing and weapon shapes. A detailed reproduction of the supplied humanoid mecha is not modeled in this build.
- Cockpit movement, handoffs, destruction, and camera spectacle use compact procedural animation. The WebGL carrier shot includes a restrained camera tilt; the software fallback preserves a fixed gameplay projection.
- Support fighters remain visible and react to handoffs. Their independent attack simulation is not implemented.
- Music and effects are synthesized placeholders. Radio dialogue is text with portraits.

### Not implemented

- Recorded voices, a mastered soundtrack, final anime portraits, detailed mechanical rigging, or a humanoid transformation mechanic.
- Real-device tuning of simultaneous two-thumb touch, haptics, and controller ergonomics.
- Additional missions, upgrades, progression, and online systems, in keeping with the requested slice scope.

### Known issues and validation limits

- The test browser disables graphics acceleration. Browser playtesting therefore exercised the software fallback. The WebGL renderer still needs a hardware-enabled browser check.
- Browser input tests used pointer events in a portrait viewport. Physical phone multi-touch, Safari, and controller hardware remain unverified.
- At extreme projectile density the software renderer may miss the 60 FPS target. WebGL uses instanced projectiles and remains the intended primary path.
- Final timing, difficulty, color accessibility, and touch lever ergonomics need human playtesting.
- The software boss art switches between prerendered turret states and uses fixed-angle ship sprites.

### Performance results

The deterministic simulation stress run reached the 650-projectile cap. Observed simulation-only update cost was approximately **0.035 ms mean / 0.112 ms p95** in the local Node runtime. This excludes drawing, browser input, and audio.

The software fallback's portrait boss sample reported approximately **16.66 ms mean / 16.8 ms p95** with 27 seeded bullets, about 60 FPS. The 650-projectile stress fixture initially slowed; bullet drawing was then changed to cached textures. The final 650-projectile sample reported **18.74 ms mean / 33.30 ms p95**, about **53 FPS**. See `validation.json` for the recorded observations. These are short cloud-browser measurements, not sustained mobile-device certification.

### Recommended next iteration

Play one complete mission on the intended phone and one on desktop. Tune the lever distance and angular sectors from missed shifts, then tune enemy timing from damage and cancellation observations. Validate the WebGL path and replace the opening figure and portrait placeholders with approved Black Wing character artwork.

## Source structure

- `core.js`: deterministic combat, input-independent rules, timeline, enemies, boss, collision, and score.
- `render.js`: original 3D model factories, WebGL scene, ocean shader, and instanced effects.
- `software.js`: 3D-to-sprite rasterizer and software rendering fallback.
- `audio.js`: original Web Audio score and sound effects.
- `main.js`: DOM interface, input, portraits, dialogue, audio routing, and frame loop.
- `template.html`: interface and responsive styling.
- `build.py`: bundles all local source and the included renderer into one HTML document.
- `tests.cjs`: meaningful simulation checks and stress measurement.
- `server.cjs`: optional local preview server.
- `vendor/three.module.js`, `vendor/THREE-LICENSE.txt`: bundled local renderer and license.
- `references/robot01.jpg`: supplied design reference.

## Rebuild and test

Python 3 and Node are only needed for editing and verification; playing needs neither.

```sh
python3 build.py
node tests.cjs
```

Optional server:

```sh
node server.cjs --port 4173
```

Open the local server address in your browser. Diagnostic URLs `?qa=title`, `?qa=mixed`, `?qa=carrier`, `?qa=boss`, and `?qa=density` select development fixtures and show read-only statistics. Normal launches do not enable fixtures. The density fixture provides temporary damage protection solely for stress inspection.
