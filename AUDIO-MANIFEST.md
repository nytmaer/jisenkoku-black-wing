# Jisenkoku: Black Wing — Audio Manifest (Mission 01)

Drop everything into one folder with this layout. Use the exact filenames: the game maps sounds by name.

```
audio/
  music/
  sfx/
```

## Format

| | Music | SFX |
| --- | --- | --- |
| File type | WAV | WAV |
| Sample rate | 44.1 or 48 kHz | 44.1 or 48 kHz |
| Bit depth | 16 or 24-bit | 16 or 24-bit |
| Channels | Stereo | Mono preferred (stereo is fine) |
| Peak level | about −1 dBFS | about −1 dBFS |
| Silence | Loops must start and end exactly on the beat | Trim all leading silence; the sound must start on the first sample |

Variants: where a row says **×3**, give `_1`, `_2`, `_3` versions. The game picks one at random so repeated sounds don't machine-gun. If you only have one, just give `_1`.

## Music — `audio/music/`

| File | Length | Notes |
| --- | --- | --- |
| `stage_intro.wav` | 5–20 s | Plays once at IKUZE!, then flows straight into the loop. Optional. |
| `stage_loop.wav` | 2–4 min | **Must loop seamlessly**: the last sample flows into the first. Covers 0:00–3:51 of the mission. |
| `boss_intro.wav` | 3–10 s | Optional sting under the WARNING banner. |
| `boss_loop.wav` | 1–3 min | Seamless loop. Crossfades in when the boss appears. If you skip this, the stage loop continues. |
| `clear.wav` | 5–15 s | Victory / mission complete. Does not loop. |
| `gameover.wav` | 3–8 s | Formation lost. Does not loop. Optional. |

Send the **BPM** of each loop if you know it. I'll line section changes up with bar lines.

## Sound effects — `audio/sfx/`

### Player

| File | Length | Notes |
| --- | --- | --- |
| `shot_kevo.wav` | 0.05–0.10 s | Plays several times a second. Short, light, not fatiguing. Focused twin shots. |
| `shot_m.wav` | 0.05–0.10 s | Same constraints. Softer and wider, for the spread shot. |
| `shot_daiga.wav` | 0.08–0.15 s | Heavier cannon thump, still short. |
| `shift_kevo.wav` | 0.2–0.4 s | Dimension shift into blue. Sharp, bright. |
| `shift_m.wav` | 0.2–0.4 s | Shift into white. Shimmering, crystalline. |
| `shift_daiga.wav` | 0.2–0.4 s | Shift into red. Low, aggressive. |
| `cancel_1..3.wav` ×3 | 0.08–0.2 s | Absorbing a matching bullet. Satisfying high chime. Plays a lot, so keep it gentle. |
| `graze.wav` | 0.03–0.08 s | Bullet brushing past. Tiny tick or scrape. Very quiet. |
| `hit.wav` | 0.3–0.6 s | Taking damage. Alarm-like crunch. Must cut through everything. |
| `focus_on.wav` | 0.05–0.15 s | Optional. Click when focus is held. |

### Enemies

| File | Length | Notes |
| --- | --- | --- |
| `enemy_shot.wav` | 0.05–0.12 s | Generic enemy fire. Many per second at peak, so keep it short and mid-low. |
| `explode_small_1..3.wav` ×3 | 0.3–0.7 s | Scout and lancer kills. Punchy pop. |
| `explode_large_1..3.wav` ×3 | 0.8–1.5 s | Heavy kills and boss turrets. Big boom with a tail. |
| `telegraph.wav` | 0.3–0.65 s | Optional. Charge-up before a heavy fires. |

### Boss

| File | Length | Notes |
| --- | --- | --- |
| `boss_warning.wav` | 2–3.5 s | Siren or klaxon under the WARNING banner. |
| `boss_shot.wav` | 0.15–0.3 s | Boss volley. Heavier than `enemy_shot`. |
| `boss_phase.wav` | 0.8–1.5 s | Phase change. Bullets turn to gold, with a slow-motion whoosh. |
| `boss_death.wav` | 2.5–4 s | Chained explosions into a final blast. Covers the 2.6 s death sequence. |

### Score and items

| File | Length | Notes |
| --- | --- | --- |
| `item.wav` | 0.03–0.08 s | Gold item pickup. Bright coin tick. Plays in rapid bursts, so it must be tiny. |
| `chain_up.wav` | 0.2–0.4 s | Optional. Cancel-chain multiplier going up. |

### Interface and story

| File | Length | Notes |
| --- | --- | --- |
| `ui_confirm.wav` | 0.1–0.3 s | Launch / menu confirm. |
| `ui_pause.wav` | 0.1–0.3 s | Pause / resume. |
| `section.wav` | 0.5–1.5 s | Section banner appears (第一区画 …). |
| `radio.wav` | 0.1–0.3 s | Optional. Comms blip when a portrait pops up. |
| `ikuze.wav` | 0.5–1.5 s | Launch sting at 「行くぜ！」. Could be a voice line. |

### Optional voice lines

| File | Notes |
| --- | --- |
| `vo_ikuze.wav` | Kevo: "Ikuze!" |
| `vo_warning.wav` | Announcer: "Warning." |
| `vo_clear.wav` | Announcer: "Mission complete." |

## Minimum set

If you want to start small, these 16 cover the core loop. Synthesized sound fills anything missing.

`stage_loop`, `boss_loop`, `clear`, `shot_kevo`, `shot_m`, `shot_daiga`, `shift_kevo`, `shift_m`, `shift_daiga`, `cancel_1`, `explode_small_1`, `explode_large_1`, `hit`, `boss_warning`, `boss_death`, `item`

When it's ready, send me the folder path. I'll convert to OGG, embed it, and wire up mixing: music ducks under big hits, voices are capped so 40 cancels don't stack, and pitch varies slightly on repeats.
