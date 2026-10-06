// Draws the branching Brownian motion figure under the introduction.
// One particle starts at the left; it moves as a Brownian motion and splits in
// two at rate beta(x) = 1 + 0.9 cos(2*pi*x / L), which is periodic in space.
// The random seed is fixed, so every visitor sees the same picture.
(function () {
  const svg = document.getElementById("bbm");
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";

  // Small seeded random number generator (mulberry32) + Gaussian samples.
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function simulate() {
    const rand = rng(13);
    const gauss = () => {
      const u = 1 - rand(), v = rand();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    const T = 5, N = 300, dt = T / N, L = 2.4, CAP = 260, S = 1.4;
    const beta = (x) => 1 + 0.9 * Math.cos((2 * Math.PI * x) / L);
    const particles = [{ pts: [[0, 0]], x: 0 }];
    for (let k = 1; k <= N; k++) {
      const t = k * dt;
      const born = [];
      for (const p of particles) {
        p.x += S * Math.sqrt(dt) * gauss();
        if (k % 2 === 0 || k === N) p.pts.push([t, p.x]);
        if (particles.length + born.length < CAP && rand() < beta(p.x) * dt) {
          born.push({ pts: [[t, p.x]], x: p.x });
        }
      }
      particles.push(...born);
    }
    return { particles, T, L };
  }

  const sim = simulate();
  let drawnFor = null;

  function draw() {
    const H = window.innerWidth < 600 ? 420 : 240;
    if (drawnFor === H) return;
    drawnFor = H;
    const W = 1000;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.removeAttribute("preserveAspectRatio");
    svg.replaceChildren();

    // Fit the spatial range to the simulated cloud, with a little margin.
    const XMAX = 1.1 * Math.max(...sim.particles.flatMap((p) => p.pts.map(([, x]) => Math.abs(x))));
    const sx = (t) => 8 + (t / sim.T) * (W - 16);
    const sy = (x) => H / 2 - (x / XMAX) * (H / 2 - 6);

    // Shaded bands: where the branching rate is above average.
    const bands = document.createElementNS(NS, "g");
    for (let j = -Math.ceil(XMAX / sim.L) - 1; j <= Math.ceil(XMAX / sim.L) + 1; j++) {
      const lo = j * sim.L - sim.L / 4, hi = j * sim.L + sim.L / 4;
      const r = document.createElementNS(NS, "rect");
      r.setAttribute("class", "band");
      r.setAttribute("x", 0);
      r.setAttribute("width", W);
      r.setAttribute("y", sy(hi).toFixed(1));
      r.setAttribute("height", (sy(lo) - sy(hi)).toFixed(1));
      bands.appendChild(r);
    }
    svg.appendChild(bands);

    // Clip used to reveal the paths from left to right once.
    const defs = document.createElementNS(NS, "defs");
    const clip = document.createElementNS(NS, "clipPath");
    clip.setAttribute("id", "reveal");
    const clipRect = document.createElementNS(NS, "rect");
    clipRect.setAttribute("x", 0); clipRect.setAttribute("y", 0);
    clipRect.setAttribute("height", H);
    clip.appendChild(clipRect); defs.appendChild(clip); svg.appendChild(defs);

    const g = document.createElementNS(NS, "g");
    g.setAttribute("clip-path", "url(#reveal)");
    for (const p of sim.particles) {
      const path = document.createElementNS(NS, "path");
      path.setAttribute("class", "path");
      path.setAttribute("d", p.pts.map(([t, x], i) =>
        (i ? "L" : "M") + sx(t).toFixed(1) + " " + sy(x).toFixed(1)).join(""));
      g.appendChild(path);
    }
    svg.appendChild(g);

    const root = document.createElementNS(NS, "circle");
    root.setAttribute("class", "root");
    root.setAttribute("cx", sx(0)); root.setAttribute("cy", sy(0)); root.setAttribute("r", 3);
    svg.appendChild(root);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || draw.revealed) { clipRect.setAttribute("width", W); return; }
    draw.revealed = true;
    const start = performance.now(), dur = 2600;
    (function step(now) {
      const u = Math.min(1, Math.max(0, (now - start) / dur));
      const eased = 1 - Math.pow(1 - u, 3);
      clipRect.setAttribute("width", (eased * W).toFixed(1));
      if (u < 1) requestAnimationFrame(step);
    })(start);
  }

  draw();
  window.addEventListener("resize", draw);
})();
