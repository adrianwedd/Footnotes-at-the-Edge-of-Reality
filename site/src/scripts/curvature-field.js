// curvature-field.js
// Renders gravitational field as flowing streamlines (field gradient flow)
// Tick-based, minute-scale drift, respects reduced-motion

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Seeded RNG (Mulberry32)
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

// Adaptive grid size and tick rate by viewport
function gridForViewport(w, h) {
  const minDim = Math.min(w, h);
  if (minDim < 520) return { nx: 120, ny: 68, tickMs: 1000, seeds: 20 };
  if (minDim < 900) return { nx: 180, ny: 101, tickMs: 800, seeds: 35 };
  return { nx: 240, ny: 135, tickMs: 500, seeds: 50 };
}

// Deterministic mass motion (slow orbits)
function massesAtTime({ seed, tMs, w, h, count = 3 }) {
  const masses = [];
  for (let i = 0; i < count; i++) {
    const rng = mulberry32(seed + i * 1013);
    const cx = 0.5 + (rng() - 0.5) * 0.10;
    const cy = 0.5 + (rng() - 0.5) * 0.10;
    const radius = 0.20 + rng() * 0.12;
    const ecc = 0.85 + rng() * 0.20;
    const period = (10 + rng() * 10) * 60_000;
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

// Compute gravitational potential φ on grid
function computePhiGrid({ nx, ny, w, h, masses, epsilonPx }) {
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

// Compute gradient field ∇φ (direction of flow)
function computeGradient(phi, nx, ny, w, h) {
  const grad = new Array(nx * ny);
  const dx = w / (nx - 1);
  const dy = h / (ny - 1);

  for (let j = 1; j < ny - 1; j++) {
    for (let i = 1; i < nx - 1; i++) {
      const idx = j * nx + i;
      const gx = (phi[idx + 1] - phi[idx - 1]) / (2 * dx);
      const gy = (phi[idx + nx] - phi[idx - nx]) / (2 * dy);
      grad[idx] = { x: gx, y: gy };
    }
  }

  // Fill edges with zero gradient
  for (let i = 0; i < nx; i++) {
    grad[i] = { x: 0, y: 0 };
    grad[(ny - 1) * nx + i] = { x: 0, y: 0 };
  }
  for (let j = 0; j < ny; j++) {
    grad[j * nx] = { x: 0, y: 0 };
    grad[j * nx + nx - 1] = { x: 0, y: 0 };
  }

  return grad;
}

// Bilinear sample gradient at continuous (x, y) position
function sampleGradient(grad, x, y, nx, ny, w, h) {
  const dx = w / (nx - 1);
  const dy = h / (ny - 1);
  const fi = x / dx;
  const fj = y / dy;
  const i = Math.floor(fi);
  const j = Math.floor(fj);

  if (i < 0 || j < 0 || i >= nx - 1 || j >= ny - 1) return null;

  const fx = fi - i;
  const fy = fj - j;

  const g00 = grad[j * nx + i] || { x: 0, y: 0 };
  const g10 = grad[j * nx + i + 1] || { x: 0, y: 0 };
  const g01 = grad[(j + 1) * nx + i] || { x: 0, y: 0 };
  const g11 = grad[(j + 1) * nx + i + 1] || { x: 0, y: 0 };

  const gx =
    g00.x * (1 - fx) * (1 - fy) +
    g10.x * fx * (1 - fy) +
    g01.x * (1 - fx) * fy +
    g11.x * fx * fy;

  const gy =
    g00.y * (1 - fx) * (1 - fy) +
    g10.y * fx * (1 - fy) +
    g01.y * (1 - fx) * fy +
    g11.y * fx * fy;

  return { x: gx, y: gy };
}

// Integrate streamline using RK4
function integrateStreamline(seed, grad, nx, ny, w, h, maxSteps = 200, dt = 2.5) {
  const points = [];
  let pos = { ...seed };

  for (let step = 0; step < maxSteps; step++) {
    points.push({ ...pos });

    // RK4 integration
    const k1 = sampleGradient(grad, pos.x, pos.y, nx, ny, w, h);
    if (!k1 || (k1.x * k1.x + k1.y * k1.y) < 1e-8) break;

    const pos2 = { x: pos.x + k1.x * dt * 0.5, y: pos.y + k1.y * dt * 0.5 };
    const k2 = sampleGradient(grad, pos2.x, pos2.y, nx, ny, w, h);
    if (!k2) break;

    const pos3 = { x: pos.x + k2.x * dt * 0.5, y: pos.y + k2.y * dt * 0.5 };
    const k3 = sampleGradient(grad, pos3.x, pos3.y, nx, ny, w, h);
    if (!k3) break;

    const pos4 = { x: pos.x + k3.x * dt, y: pos.y + k3.y * dt };
    const k4 = sampleGradient(grad, pos4.x, pos4.y, nx, ny, w, h);
    if (!k4) break;

    pos.x += (dt / 6) * (k1.x + 2 * k2.x + 2 * k3.x + k4.x);
    pos.y += (dt / 6) * (k1.y + 2 * k2.y + 2 * k3.y + k4.y);

    // Stop if out of bounds
    if (pos.x < 0 || pos.x > w || pos.y < 0 || pos.y > h) break;
  }

  return points;
}

// Generate seed points (deterministic sparse distribution)
function generateSeeds(seed, count, w, h, masses) {
  const rng = mulberry32(seed + 9999);
  const seeds = [];

  // Mix of random scatter and rings around masses
  const randomCount = Math.floor(count * 0.6);
  const ringCount = count - randomCount;

  // Random scatter
  for (let i = 0; i < randomCount; i++) {
    seeds.push({
      x: rng() * w,
      y: rng() * h
    });
  }

  // Rings around masses
  const ringsPerMass = Math.ceil(ringCount / masses.length);
  for (const mass of masses) {
    for (let i = 0; i < ringsPerMass; i++) {
      const angle = rng() * Math.PI * 2;
      const radius = (80 + rng() * 120); // px from mass
      seeds.push({
        x: mass.x + radius * Math.cos(angle),
        y: mass.y + radius * Math.sin(angle)
      });
    }
  }

  return seeds.slice(0, count);
}

// Render streamlines with fade-in/fade-out
function renderStreamlines(ctx, streamlines, w, h) {
  ctx.clearRect(0, 0, w, h);

  for (const line of streamlines) {
    if (line.length < 3) continue;

    const fadeIn = Math.min(8, Math.floor(line.length * 0.15));
    const fadeOut = Math.min(8, Math.floor(line.length * 0.15));

    for (let i = 0; i < line.length - 1; i++) {
      // Compute fade alpha
      let alpha = 0.12;
      if (i < fadeIn) {
        alpha *= i / fadeIn;
      } else if (i > line.length - fadeOut) {
        alpha *= (line.length - i) / fadeOut;
      }

      ctx.strokeStyle = `rgba(200, 220, 255, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(line[i].x, line[i].y);
      ctx.lineTo(line[i + 1].x, line[i + 1].y);
      ctx.stroke();
    }
  }
}

// Main initialization
export function initCurvatureField({ canvasId, seed = 42, masses = 3, epsilon = 140 } = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return;

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

    const { nx, ny, seeds: seedCount } = gridForViewport(w, h);
    const tMs = tNow - t0;

    // Compute field
    const m = massesAtTime({ seed, tMs, w, h, count: masses });
    const phi = computePhiGrid({ nx, ny, w, h, masses: m, epsilonPx: epsilon });
    const grad = computeGradient(phi, nx, ny, w, h);

    // Generate streamlines
    const seedPoints = generateSeeds(seed, seedCount, w, h, m);
    const streamlines = seedPoints.map(s =>
      integrateStreamline(s, grad, nx, ny, w, h, 200, 2.5)
    );

    // Render
    renderStreamlines(ctx, streamlines, w, h);
  }

  function start() {
    const { tickMs } = gridForViewport(window.innerWidth, window.innerHeight);

    resizeAndDraw(performance.now());

    if (reduced) return;

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
