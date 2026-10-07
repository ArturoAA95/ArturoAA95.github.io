// Test-case viewer for the numerical method: pick a domain thumbnail, and that
// domain is shown next to its computed solution.
//
// Files live in numerics/: caseNN-thumb.webp, caseNN-domain.webp, caseNN-solution.webp
// To add a case, put its three files there and add its number to one of the groups.
const CASE_GROUPS = [
  { label: "Square domain",     cases: [1, 2, 5, 9, 10] },
  { label: "Non-convex domain", cases: [13, 14, 16, 17, 19] },
];

(function () {
  const root = document.getElementById("cases");
  if (!root) return;
  const pick = root.querySelector(".cases-pick");
  const name = root.querySelector(".cases-name");
  const panels = {
    domain: root.querySelector('[data-panel="domain"]'),
    solution: root.querySelector('[data-panel="solution"]'),
  };
  const file = (n, kind) => `numerics/case${String(n).padStart(2, "0")}-${kind}.webp`;

  // Load every full-size picture up front so switching cases is instant.
  for (const g of CASE_GROUPS) for (const n of g.cases) {
    for (const kind of ["domain", "solution"]) { const im = new Image(); im.src = file(n, kind); }
  }

  const buttons = [];
  function select(n) {
    for (const kind of ["domain", "solution"]) {
      const a = panels[kind];
      a.href = file(n, kind);
      const img = a.querySelector("img");
      img.src = file(n, kind);
      img.alt = kind === "domain"
        ? `Test case ${n}: the domain, split into eikonal and Brownian regions`
        : `Test case ${n}: the computed solution with its level curves and the interface`;
    }
    name.textContent = `Test case ${n}.`;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.case === n)));
  }

  for (const g of CASE_GROUPS) {
    const group = document.createElement("div");
    group.className = "cases-group";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", g.label);
    const label = document.createElement("p");
    label.className = "sim-label";
    label.textContent = g.label;
    const row = document.createElement("div");
    row.className = "cases-row";
    for (const n of g.cases) {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.case = n;
      b.setAttribute("aria-label", `Test case ${n}`);
      b.title = `Test case ${n}`;
      const img = document.createElement("img");
      img.src = file(n, "thumb");
      img.alt = "";
      b.appendChild(img);
      b.addEventListener("click", () => select(n));
      buttons.push(b);
      row.appendChild(b);
    }
    group.append(label, row);
    pick.appendChild(group);
  }

  select(CASE_GROUPS[0].cases[0]);
})();
