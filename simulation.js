// Side-by-side simulation player: particles on the left, density on the right,
// driven by one play button and one time slider.
//
// HOW TO ADD ANOTHER SEQUENCE:
//   1. Put the frames in a new folder, e.g. sims/another/, named
//      particles-01.webp ... particles-10.webp and density-01.webp ... density-10.webp
//      (01 = earliest time). PNG works too: change "ext" below.
//   2. Copy one of the blocks below, paste it before the final "];", and change
//      id, label, folder and times. The "environment" part is optional.
// When there is more than one sequence, buttons to switch between them appear
// automatically above the player.
const SEQUENCES = [
  {
    id: "homogeneous",
    label: "Homogeneous environment",
    folder: "sims/homogeneous",
    ext: "webp",
    times: [1.8, 3.6, 5.4, 7.2, 9, 10.8, 12.6, 14.4, 16.2, 18],
  },
  {
    id: "heterogeneous",
    label: "Periodic environment",
    folder: "sims/heterogeneous",
    ext: "webp",
    times: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30],
    // Optional picture of the environment, shown under the player with a note.
    environment: {
      src: "sims/heterogeneous/environment.webp",
      alt: "The environment g: vertical stripes alternating between 0 and 1, each of width 1.",
      note: "The environment g alternates between 0 and 1 in vertical stripes of width 1. The density picks up the same stripes as the population grows.",
    },
  },
];

(function () {
  const root = document.getElementById("sim");
  if (!root || !SEQUENCES.length) return;

  const FRAME_MS = 700;      // time each frame is shown while playing
  const HOLD_MS = 1600;      // pause on the last frame before looping
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tracks = {
    particles: root.querySelector('[data-track="particles"]'),
    density: root.querySelector('[data-track="density"]'),
  };
  const button = root.querySelector(".sim-play");
  const slider = root.querySelector(".sim-slider");
  const label = root.querySelector(".sim-time");
  const switcher = root.querySelector(".sim-switch");
  const env = root.querySelector(".sim-env");

  let seq = null, frame = 0, playing = false, timer = null, visible = false;
  let ready = false, wantPlay = false;

  // Build the frames of every sequence once, as soon as the page opens, so they
  // download and decode in the background. A sequence only plays once all of its
  // frames are decoded; this avoids blank or flickering frames on the first run.
  const built = new Map();
  for (const s of SEQUENCES) {
    const imgs = { particles: [], density: [] };
    for (const kind of ["particles", "density"]) {
      s.times.forEach((t, i) => {
        const img = new Image();
        img.alt = `${kind === "particles" ? "Particle positions" : "Particle density"} at time T = ${t}`;
        img.src = `${s.folder}/${kind}-${String(i + 1).padStart(2, "0")}.${s.ext || "webp"}`;
        imgs[kind].push(img);
      });
    }
    const all = [...imgs.particles, ...imgs.density];
    if (s.environment) { const e = new Image(); e.src = s.environment.src; all.push(e); }
    const done = Promise.all(all.map((img) => img.decode().catch(() => {})));
    built.set(s.id, { imgs, done });
  }

  function load(s) {
    seq = s;
    const b = built.get(s.id);
    tracks.particles.replaceChildren(...b.imgs.particles);
    tracks.density.replaceChildren(...b.imgs.density);
    slider.max = s.times.length - 1;

    // Environment picture and note, if this sequence has one.
    if (env) {
      env.hidden = !s.environment;
      if (s.environment) {
        env.querySelector("img").src = s.environment.src;
        env.querySelector("img").alt = s.environment.alt || "";
        env.querySelector("p").textContent = s.environment.note || "";
      }
    }
    show(0);

    ready = false;
    button.disabled = true;
    button.textContent = "Loading…";
    b.done.then(() => {
      if (seq !== s) return;            // the visitor switched again meanwhile
      ready = true;
      button.disabled = false;
      button.textContent = "Play";
      if (wantPlay) { wantPlay = false; play(); }
    });
  }

  function show(i) {
    frame = i;
    for (const box of Object.values(tracks)) {
      [...box.children].forEach((img, k) => img.classList.toggle("is-active", k === i));
    }
    slider.value = i;
    label.textContent = `T = ${seq.times[i]}`;
  }

  function tick() {
    const last = seq.times.length - 1;
    show(frame === last ? 0 : frame + 1);
    timer = setTimeout(tick, frame === last ? HOLD_MS : FRAME_MS);
  }

  function play() {
    if (!ready) { wantPlay = true; return; }   // starts as soon as the frames are ready
    if (playing) return;
    playing = true;
    button.textContent = "Pause";
    button.setAttribute("aria-label", "Pause the animation");
    if (frame === seq.times.length - 1) show(0);
    timer = setTimeout(tick, FRAME_MS);
  }

  function pause() {
    wantPlay = false;
    playing = false;
    clearTimeout(timer);
    if (!ready) return;
    button.textContent = "Play";
    button.setAttribute("aria-label", "Play the animation");
  }

  button.addEventListener("click", () => {
    userPaused = playing;
    playing ? pause() : play();
  });
  slider.addEventListener("input", () => { pause(); userPaused = true; show(+slider.value); });

  // Buttons to switch between sequences, only when there is more than one.
  if (SEQUENCES.length > 1) {
    SEQUENCES.forEach((s, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = s.label;
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", () => {
        switcher.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
        const wasPlaying = playing || wantPlay;
        pause();
        load(s);
        if (wasPlaying) play();
      });
      switcher.appendChild(b);
    });
  } else {
    switcher.remove();
  }

  load(SEQUENCES[0]);

  // Play automatically while the player is on screen, unless the visitor paused it
  // or prefers reduced motion. Off screen it stops, to save battery.
  let userPaused = still;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !userPaused) play();
      if (!visible && playing) pause();
    }, { threshold: 0.4 }).observe(root);
  } else if (!still) {
    play();
  }
})();
