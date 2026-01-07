// curvature-field.js
// Tick-based curvature field renderer (minute-scale drift).
// No dependencies. Designed to be subtle and low-CPU.
//
// Implementation notes:
// - Deterministic mass motion from (seed, t)
// - Tick loop (setInterval) not RAF
// - Pause on tab hidden
// - prefers-reduced-motion => static frame only
//
// This file is a *skeleton* to accelerate implementation.

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Simple seeded RNG (Mulberry32)
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Compute adaptive grid size by viewport
function gridForViewport(w, h) {
  const minDim = Math.min(w, h);
  if (minDim < 520) return { nx: 80, ny: 45, tickMs: 1500 };    // mobile
  if (minDim < 900) return { nx: 100, ny: 56, tickMs: 1200 };   // small tablet
  return { nx: 120, ny: 68, tickMs: 800 };                      // desktop
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

// TODO: percentile clamp utility for normalization (2nd–98th)
function percentileClamp(values, loP = 0.02, hiP = 0.98) {
  const sorted = [...values].sort((a, b) => a - b);
  const lo = sorted[Math.floor(loP * (sorted.length - 1))];
  const hi = sorted[Math.floor(hiP * (sorted.length - 1))];
  return { lo, hi };
}

// Deterministic mass motion: slow, slightly eccentric orbit
function massesAtTime({ seed, tMs, w, h, count = 3 }) {
  const masses = [];
  for (let i = 0; i < count; i++) {
    const rng = mulberry32(seed + i * 1013);
    const cx = 0.5 + (rng() - 0.5) * 0.10; // keep near center-ish
    const cy = 0.5 + (rng() - 0.5) * 0.10;
    const radius = 0.20 + rng() * 0.12; // fraction of min dim
    const ecc = 0.85 + rng() * 0.20;
    const period = (10 + rng() * 10) * 60_000; // 10–20 minutes
    const phase = rng() * Math.PI * 2;
    const angle = phase + (tMs / period) * Math.PI * 2;

    const minDim = Math.min(w, h);
    const x = (cx * w) + (radius * minDim) * Math.cos(angle);
    const y = (cy * h) + (radius * minDim) * ecc * Math.sin(angle);
    const weight = 0.6 + rng() * 0.8;

    masses.push({ x, y, weight });
  }
  return masses;
}

// TODO: implement φ field computation on grid
function computePhiGrid({ nx, ny, w, h, masses, epsilonPx }) {
  // returns Float32Array length nx*ny
  const phi = new Float32Array(nx * ny);
  const dx = w / (nx - 1);
  const dy = h / (ny - 1);
  const eps2 = epsilonPx * epsilonPx;

  for (let j = 0; j < ny; j++) {
    const y = j * dy;
    for (let i = 0; i < nx; i++) {
      const x = i * dx;
      let v = 0;
      for (const m of masses) {
        const rx = x - m.x;
        const ry = y - m.y;
        const r2 = rx * rx + ry * ry;
        v += -m.weight / Math.sqrt(r2 + eps2);
      }
      phi[j * nx + i] = v;
    }
  }
  return phi;
}

// TODO: normalize phi to [-1, 1] and optional tanh easing
function normalizePhi(phi) {
  let mn = Infinity, mx = -Infinity;
  for (let k = 0; k < phi.length; k++) { mn = Math.min(mn, phi[k]); mx = Math.max(mx, phi[k]); }
  const out = new Float32Array(phi.length);
  const span = mx - mn || 1;
  for (let k = 0; k < phi.length; k++) {
    const t = ((phi[k] - mn) / span) * 2 - 1;
    // mild easing (optional):
    out[k] = Math.tanh(0.9 * t);
  }
  return out;
}

// TODO: compute K = -Δφ (discrete Laplacian)
function computeCurvature(phiNorm, nx, ny) {
  const K = new Float32Array(phiNorm.length);
  for (let j = 1; j < ny - 1; j++) {
    for (let i = 1; i < nx - 1; i++) {
      const idx = j * nx + i;
      const lap = phiNorm[idx - 1] + phiNorm[idx + 1] + phiNorm[idx - nx] + phiNorm[idx + nx] - 4 * phiNorm[idx];
      K[idx] = -lap;
    }
  }
  return K;
}

// TODO: normalize K to [0,1] with percentile clamp
function normalizeK(K) {
  const vals = Array.from(K);
  const { lo, hi } = percentileClamp(vals, 0.02, 0.98);
  const out = new Float32Array(K.length);
  const span = (hi - lo) || 1;
  for (let i = 0; i < K.length; i++) out[i] = clamp01((K[i] - lo) / span);
  return out;
}

// TODO: marching squares for filled contours + isolines
// For skeleton purposes, we render a very soft shading grid instead.
// Replace with marching squares once implemented.
function renderFallbackGrid(ctx, K01, nx, ny, w, h) {
  // Subtle shading: visible if you look, but never loud
  const dx = w / (nx - 1);
  const dy = h / (ny - 1);
  ctx.clearRect(0, 0, w, h);

  // Render curvature field with gentle visibility
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const v = K01[j * nx + i];
      // Subtle but visible: 4-12% opacity range
      const a = 0.04 + v * 0.08;
      ctx.fillStyle = `rgba(220, 235, 255, ${a})`;
      ctx.fillRect(i * dx, j * dy, dx + 1, dy + 1);
    }
  }
}

// Main init
export function initCurvatureField({ canvasId, seed = 42, masses = 3, epsilon = 140 } = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return;

  // Reduced motion: draw once and stop.
  const reduced = prefersReducedMotion();

  let t0 = performance.now();
  let timer = null;

  function resizeAndDraw(tNow) {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const w = Math.floor(window.innerWidth);
    const h = Math.floor(window.innerHeight);

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { nx, ny } = gridForViewport(w, h);
    const tMs = (tNow - t0);

    const m = massesAtTime({ seed, tMs, w, h, count: masses });
    const phi = computePhiGrid({ nx, ny, w, h, masses: m, epsilonPx: epsilon });
    const phiN = normalizePhi(phi);
    const K = computeCurvature(phiN, nx, ny);
    const K01 = normalizeK(K);

    // TODO: replace with contour rendering (filled bands + isolines)
    renderFallbackGrid(ctx, K01, nx, ny, w, h);
  }

  function start() {
    const { tickMs } = gridForViewport(window.innerWidth, window.innerHeight);

    // Draw initial frame
    resizeAndDraw(performance.now());

    if (reduced) return;

    // Tick loop (not RAF)
    timer = window.setInterval(() => {
      resizeAndDraw(performance.now());
    }, tickMs);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  function onVisibility() {
    if (document.hidden) stop();
    else start();
  }

  window.addEventListener("resize", () => resizeAndDraw(performance.now()), { passive: true });
  document.addEventListener("visibilitychange", onVisibility, { passive: true });

  start();
}
