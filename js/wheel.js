/**
 * wheel.js – Builds the SVG wheel for a given WheelConfig.
 *
 * All drawing is done with programmatic SVG elements (no images needed).
 * The wheel is rendered inside the #wheel-svg element.
 */

var Wheel = (function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var SIZE = 400;
  var CX = SIZE / 2;
  var CY = SIZE / 2;
  var RADIUS = SIZE / 2 - 10;
  var INNER_R = 58; // central branding circle

  /** Degrees → radians */
  function rad(deg) {
    return (deg * Math.PI) / 180;
  }

  /** Polar → cartesian, 0° = top of circle */
  function polar(cx, cy, r, deg) {
    var a = rad(deg - 90);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  /** Create an SVG element with attributes */
  function el(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        node.setAttribute(k, attrs[k]);
      });
    }
    return node;
  }

  /** Build an arc path (pie slice from center) */
  function arcPath(startDeg, endDeg, r) {
    var p1 = polar(CX, CY, r, startDeg);
    var p2 = polar(CX, CY, r, endDeg);
    var large = endDeg - startDeg > 180 ? 1 : 0;
    return (
      "M " + CX + " " + CY +
      " L " + p1.x + " " + p1.y +
      " A " + r + " " + r + " 0 " + large + " 1 " + p2.x + " " + p2.y +
      " Z"
    );
  }

  /**
   * Render the wheel into the SVG element.
   * @param {SVGSVGElement} svg
   * @param {object} config – one of WHEEL_CONFIGS entries
   */
  function render(svg, config) {
    // Clear previous content
    svg.innerHTML = "";

    // ---- Defs (filters, gradients) ----
    var defs = el("defs");

    // Neon glow
    var fGlow = el("filter", { id: "neonGlow", x: "-20%", y: "-20%", width: "140%", height: "140%" });
    var blur1 = el("feGaussianBlur", { stdDeviation: "3", result: "b" });
    var merge1 = el("feMerge");
    merge1.appendChild(el("feMergeNode", { in: "b" }));
    merge1.appendChild(el("feMergeNode", { in: "SourceGraphic" }));
    fGlow.appendChild(blur1);
    fGlow.appendChild(merge1);
    defs.appendChild(fGlow);

    // Stronger winner glow
    var fWin = el("filter", { id: "winGlow", x: "-30%", y: "-30%", width: "160%", height: "160%" });
    var blur2 = el("feGaussianBlur", { stdDeviation: "6", result: "b2" });
    var merge2 = el("feMerge");
    merge2.appendChild(el("feMergeNode", { in: "b2" }));
    merge2.appendChild(el("feMergeNode", { in: "b2" }));
    merge2.appendChild(el("feMergeNode", { in: "SourceGraphic" }));
    fWin.appendChild(blur2);
    fWin.appendChild(merge2);
    defs.appendChild(fWin);

    // Radial bg gradient
    var grad = el("radialGradient", { id: "wheelBg" });
    grad.appendChild(el("stop", { offset: "0%", "stop-color": "#2a2a2e" }));
    grad.appendChild(el("stop", { offset: "100%", "stop-color": "#151517" }));
    defs.appendChild(grad);

    svg.appendChild(defs);

    // ---- Background disc ----
    svg.appendChild(el("circle", { cx: CX, cy: CY, r: RADIUS + 6, fill: "url(#wheelBg)" }));

    // ---- Outer neon ring ----
    svg.appendChild(el("circle", {
      cx: CX, cy: CY, r: RADIUS + 3,
      fill: "none", stroke: "rgba(64,196,255,0.30)", "stroke-width": "2.5",
      filter: "url(#neonGlow)"
    }));

    // ---- Segments ----
    var segs = config.segments;
    for (var i = 0; i < segs.length; i++) {
      var seg = segs[i];
      var startA = i * SEGMENT_ANGLE;
      var endA = startA + SEGMENT_ANGLE;
      var midA = startA + SEGMENT_ANGLE / 2;

      var g = el("g", { "data-seg": i });

      // Filled segment (low opacity color wash)
      g.appendChild(el("path", {
        d: arcPath(startA, endA, RADIUS - 2),
        fill: seg.color,
        opacity: "0.16"
      }));

      // Bright segment outline
      g.appendChild(el("path", {
        d: arcPath(startA, endA, RADIUS - 2),
        fill: "none",
        stroke: seg.glow,
        "stroke-width": "2",
        opacity: "0.55",
        filter: "url(#neonGlow)"
      }));

      // Divider line from center to rim
      var rimPt = polar(CX, CY, RADIUS - 2, startA);
      g.appendChild(el("line", {
        x1: CX, y1: CY,
        x2: rimPt.x, y2: rimPt.y,
        stroke: seg.glow,
        "stroke-width": "1.5",
        opacity: "0.45",
        filter: "url(#neonGlow)"
      }));

      // Shorthand label
      var labelR = (RADIUS + INNER_R) / 2 + 12;
      var lp = polar(CX, CY, labelR, midA);
      var txt = el("text", {
        x: lp.x, y: lp.y,
        "text-anchor": "middle",
        "dominant-baseline": "central",
        fill: "#fff",
        "font-family": "'Orbitron', sans-serif",
        "font-weight": "700",
        "font-size": seg.shorthand.length > 3 ? "15" : "21",
        style: "pointer-events:none; text-shadow:0 0 8px rgba(255,255,255,0.5)"
      });
      txt.textContent = seg.shorthand;
      g.appendChild(txt);

      svg.appendChild(g);
    }

    // ---- Central branding circle ----
    svg.appendChild(el("circle", {
      cx: CX, cy: CY, r: INNER_R,
      fill: "#111113",
      stroke: "rgba(64,196,255,0.28)",
      "stroke-width": "2",
      filter: "url(#neonGlow)"
    }));

    // Brand text: HITSTER
    var t1 = el("text", {
      x: CX, y: CY - 16,
      "text-anchor": "middle", "dominant-baseline": "central",
      fill: "#40c4ff",
      "font-family": "'Orbitron', sans-serif",
      "font-weight": "900",
      "font-size": "13",
      "letter-spacing": "0.12em"
    });
    t1.textContent = "HITSTER";
    svg.appendChild(t1);

    // Brand text: Music
    var t2 = el("text", {
      x: CX, y: CY + 2,
      "text-anchor": "middle", "dominant-baseline": "central",
      fill: "#fff",
      "font-family": "'Inter', sans-serif",
      "font-weight": "500",
      "font-size": "9",
      "letter-spacing": "0.18em",
      opacity: "0.6"
    });
    t2.textContent = "Music";
    svg.appendChild(t2);

    // Brand text: BINGO
    var t3 = el("text", {
      x: CX, y: CY + 19,
      "text-anchor": "middle", "dominant-baseline": "central",
      fill: "#ff4081",
      "font-family": "'Orbitron', sans-serif",
      "font-weight": "900",
      "font-size": "12",
      "letter-spacing": "0.16em"
    });
    t3.textContent = "BINGO";
    svg.appendChild(t3);
  }

  /**
   * Highlight (or clear) the winning segment.
   * @param {SVGSVGElement} svg
   * @param {number|null} idx – segment index or null to clear
   */
  function highlightWinner(svg, idx) {
    var groups = svg.querySelectorAll("g[data-seg]");
    groups.forEach(function (g) {
      var segIdx = parseInt(g.getAttribute("data-seg"), 10);
      var paths = g.querySelectorAll("path");
      if (segIdx === idx) {
        // Boost fill opacity and apply winner glow
        if (paths[0]) { paths[0].setAttribute("opacity", "0.35"); paths[0].setAttribute("filter", "url(#winGlow)"); }
        if (paths[1]) { paths[1].setAttribute("opacity", "1"); }
      } else {
        if (paths[0]) { paths[0].setAttribute("opacity", "0.16"); paths[0].removeAttribute("filter"); }
        if (paths[1]) { paths[1].setAttribute("opacity", "0.55"); }
      }
    });
  }

  return {
    render: render,
    highlightWinner: highlightWinner
  };
})();
