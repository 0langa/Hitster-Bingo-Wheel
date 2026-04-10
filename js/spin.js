/**
 * spin.js – Deterministic spin animation using CSS transitions.
 *
 * How the spin works:
 * 1. A random target segment index is chosen.
 * 2. We compute the exact final rotation so the pointer (at 0° / top)
 *    lands at the center of that segment.
 * 3. We add several full extra rotations for visual drama.
 * 4. A CSS transition with a cubic-bezier ease-out curve handles the
 *    smooth deceleration – no requestAnimationFrame needed.
 * 5. After the transition ends we call back with the winning index.
 */

var Spin = (function () {
  /** Cumulative rotation – always grows so the wheel never "rewinds" */
  var _baseRotation = 0;

  /** Timer for the end-of-spin callback */
  var _timer = null;

  /**
   * Execute a spin.
   * @param {SVGSVGElement} svg        – the wheel SVG element to rotate
   * @param {function}      onComplete – called with the winning segment index
   */
  function execute(svg, onComplete) {
    // 1. Pick random target
    var target = Math.floor(Math.random() * SEGMENT_COUNT);

    // 2. Angle math
    //    Segment 0 spans [0°, 72°), segment 1 spans [72°, 144°), etc.
    //    The pointer sits at the top (0° in screen space).
    //    We need the wheel to rotate so that the center of the target
    //    segment is under the pointer.
    //    Center of target = target * SEGMENT_ANGLE + SEGMENT_ANGLE / 2
    //    Required rotation mod 360 = 360 – centerOfTarget
    var segCenter = target * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    var remainder = 360 - segCenter;

    // 3. Random number of extra full turns
    var extraTurns =
      (MIN_SPINS + Math.floor(Math.random() * (MAX_SPINS - MIN_SPINS + 1))) * 360;

    // 4. Compute absolute final rotation, always forward from _baseRotation
    var currentMod = _baseRotation % 360;
    var delta = extraTurns + remainder - currentMod;
    if (delta < 0) delta += 360;
    var finalRotation = _baseRotation + delta;

    // Guarantee at least MIN_SPINS full turns of visible movement
    if (finalRotation - _baseRotation < MIN_SPINS * 360) {
      finalRotation += MIN_SPINS * 360;
    }

    // 5. Apply CSS transition + transform
    svg.style.transition =
      "transform " + SPIN_DURATION_MS + "ms cubic-bezier(0.15, 0.6, 0.25, 1)";
    svg.style.transform = "rotate(" + finalRotation + "deg)";

    // 6. Callback after animation
    clearTimeout(_timer);
    _timer = setTimeout(function () {
      _baseRotation = finalRotation;
      svg.style.transition = "none"; // remove transition so future instant moves don't animate
      if (onComplete) onComplete(target);
    }, SPIN_DURATION_MS + 80);

    return target;
  }

  /**
   * Instantly set the wheel to its current base rotation (no animation).
   * Useful when switching modes while idle.
   */
  function resetPosition(svg) {
    svg.style.transition = "none";
    svg.style.transform = "rotate(" + _baseRotation + "deg)";
  }

  return {
    execute: execute,
    resetPosition: resetPosition,
  };
})();
