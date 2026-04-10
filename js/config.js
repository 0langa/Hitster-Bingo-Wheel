/**
 * Wheel configuration – data-driven category definitions for each game mode.
 *
 * Each mode has exactly 5 segments, rendered clockwise from 12 o'clock.
 * Colors intentionally match the physical Hitster Bingo wheel:
 *   green → pink → yellow → purple → blue
 */

var WHEEL_CONFIGS = {
  anfaenger: {
    mode: "anfaenger",
    title: "Anfänger",
    segments: [
      { label: "Solokünstler/Gruppe", shorthand: "Solo",  color: "#00e676", glow: "#69ff97" },
      { label: "Vor/Nach 2000",       shorthand: "2000", color: "#ff4081", glow: "#ff80ab" },
      { label: "Jahr ± 4",            shorthand: "±4",   color: "#ffea00", glow: "#ffff56" },
      { label: "Jahrzehnt",           shorthand: "10s",  color: "#b388ff", glow: "#d1c4e9" },
      { label: "Jahr ± 2",            shorthand: "±2",   color: "#40c4ff", glow: "#80d8ff" },
    ],
  },
  profi: {
    mode: "profi",
    title: "Profi",
    segments: [
      { label: "Songtitel",           shorthand: "Song",  color: "#00e676", glow: "#69ff97" },
      { label: "Genaues Jahr",        shorthand: "Jahr", color: "#ff4081", glow: "#ff80ab" },
      { label: "Künstler/Bandname",   shorthand: "Band",  color: "#ffea00", glow: "#ffff56" },
      { label: "Jahrzehnt",           shorthand: "10s",  color: "#b388ff", glow: "#d1c4e9" },
      { label: "Jahr ± 3",            shorthand: "±3",   color: "#40c4ff", glow: "#80d8ff" },
    ],
  },
};

/** Number of segments (always 5) */
var SEGMENT_COUNT = 5;

/** Degrees per segment */
var SEGMENT_ANGLE = 360 / SEGMENT_COUNT; // 72

/** Minimum additional full rotations during a spin */
var MIN_SPINS = 5;

/** Maximum additional full rotations during a spin */
var MAX_SPINS = 8;

/** Total spin animation duration in milliseconds */
var SPIN_DURATION_MS = 4000;
