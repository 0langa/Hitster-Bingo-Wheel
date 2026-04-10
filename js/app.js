/**
 * app.js – Wires everything together: mode switching, spin, legend, result.
 * Runs on DOMContentLoaded.
 */

(function () {
  "use strict";

  // ---- DOM refs ----
  var svg = document.getElementById("wheel-svg");
  var spinBtn = document.getElementById("spin-btn");
  var legendEl = document.getElementById("legend");
  var resultEl = document.getElementById("result");
  var modeBtns = document.querySelectorAll(".mode-btn");

  // ---- State ----
  var currentMode = "anfaenger";
  var spinning = false;
  var winnerIndex = null;

  // ---- Helpers ----

  function getConfig() {
    return WHEEL_CONFIGS[currentMode];
  }

  /** Rebuild the legend list from the current config */
  function renderLegend() {
    var config = getConfig();
    legendEl.innerHTML = "";
    config.segments.forEach(function (seg, i) {
      var item = document.createElement("div");
      item.className = "legend-item";
      item.setAttribute("role", "listitem");
      item.setAttribute("data-seg", i);

      var dot = document.createElement("span");
      dot.className = "legend-dot";
      dot.style.background = seg.color;
      dot.style.boxShadow = "0 0 8px " + seg.glow;

      var label = document.createElement("span");
      label.className = "legend-label";
      label.textContent = seg.label;

      item.appendChild(dot);
      item.appendChild(label);
      legendEl.appendChild(item);
    });
  }

  /** Show idle / spinning / result state */
  function renderResult() {
    var config = getConfig();

    if (spinning) {
      resultEl.innerHTML = '<span class="result-spinning">🎶</span>';
      return;
    }

    if (winnerIndex === null) {
      resultEl.innerHTML = '<span class="result-idle">Drücke Spin!</span>';
      return;
    }

    var seg = config.segments[winnerIndex];
    resultEl.innerHTML =
      '<span class="result-mode">Modus: ' + config.title + "</span>" +
      '<span class="result-category" style="color:' +
      seg.color +
      "; text-shadow: 0 0 18px " +
      seg.glow +
      ", 0 0 40px " +
      seg.color +
      '44">' +
      seg.label +
      "</span>" +
      '<span class="result-hint">Nächste Kategorie</span>';
  }

  /** Highlight the winning legend item */
  function highlightLegend() {
    var items = legendEl.querySelectorAll(".legend-item");
    items.forEach(function (item) {
      var idx = parseInt(item.getAttribute("data-seg"), 10);
      if (idx === winnerIndex && !spinning) {
        item.classList.add("highlight");
      } else {
        item.classList.remove("highlight");
      }
    });
  }

  /** Full UI refresh */
  function updateUI() {
    renderLegend();
    renderResult();
    highlightLegend();

    // Spin button state
    spinBtn.disabled = spinning;
    if (spinning) {
      spinBtn.classList.add("spinning");
      spinBtn.textContent = "Dreht…";
      spinBtn.setAttribute("aria-label", "Rad dreht sich…");
    } else {
      spinBtn.classList.remove("spinning");
      spinBtn.textContent = "Spin!";
      spinBtn.setAttribute("aria-label", "Rad drehen");
    }

    // Mode button state
    modeBtns.forEach(function (btn) {
      var m = btn.getAttribute("data-mode");
      btn.classList.toggle("active", m === currentMode);
      btn.setAttribute("aria-checked", m === currentMode ? "true" : "false");
      btn.disabled = spinning;
    });
  }

  // ---- Mode switching ----

  modeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var mode = btn.getAttribute("data-mode");
      if (mode === currentMode || spinning) return;
      currentMode = mode;
      winnerIndex = null;

      Wheel.render(svg, getConfig());
      Spin.resetPosition(svg);
      Wheel.highlightWinner(svg, null);
      updateUI();
    });
  });

  // ---- Spin ----

  spinBtn.addEventListener("click", function () {
    if (spinning) return;

    spinning = true;
    winnerIndex = null;
    Wheel.highlightWinner(svg, null);
    updateUI();

    Spin.execute(svg, function (idx) {
      spinning = false;
      winnerIndex = idx;
      Wheel.highlightWinner(svg, idx);
      updateUI();
    });
  });

  // ---- Initial render ----

  Wheel.render(svg, getConfig());
  Spin.resetPosition(svg);
  updateUI();
})();
