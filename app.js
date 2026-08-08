const STORE = "pt_public_pwa_settings";
const TZ = "America/Lima";
const DATA_URL = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json";
const MEDIA_BASE = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/";
const SESSION_META = {
  lower_a_am: "Piernas A",
  upper_a_pm: "Torso A",
  upper_pre_football_am: "Torso pre-futbol",
  football_pm: "Futbol",
  recovery: "Recuperacion",
  lower_b_am: "Piernas B",
  mobility_pm_optional: "Movilidad opcional",
  full_body_express: "Full body express",
  weighted_walk_am: "Caminata con peso",
  rest_or_swim_or_optional_weighted_walk: "Descanso / natacion / caminata opcional",
};
const EX = {
  "goblet squat": ["Goblet squat", "3 x 6-10", "strength"],
  "dumbbell romanian deadlift": ["Peso muerto rumano", "3 x 8-12", "strength"],
  "dumbbell reverse lunge": ["Zancada hacia atras", "2 x 8-10 / pierna", "strength"],
  "dumbbell standing calf raise": ["Elevacion de pantorrillas", "2 x 12-20", "strength"],
  "dead bug": ["Dead bug", "2 x 8-12 / lado", "strength"],
  "dumbbell bench press": ["Press de pecho", "3 x 6-12", "strength"],
  "one arm dumbbell row": ["Remo con mancuerna", "3 x 8-12", "strength"],
  "dumbbell shoulder press": ["Press de hombros", "2-3 x 6-10", "strength"],
  "dumbbell lateral raise": ["Elevaciones laterales", "2 x 12-20", "strength"],
  "dumbbell hammer curl": ["Curl martillo", "2 x 8-12", "strength"],
  "dumbbell step up": ["Step-up con mancuerna", "2 x 8-12 / pierna", "strength"],
  "dumbbell hip thrust": ["Hip thrust con mancuerna", "2 x 8-12", "strength"],
  plank: ["Plancha", "2 x 30-45 s", "duration"],
  "dumbbell split squat": ["Split squat con mancuerna", "2 x 8 / pierna", "strength"],
};
const SPECIAL = {
  football_pm: [["soccer", "Futbol", "60 min", "duration"]],
  recovery: [["stretching", "Movilidad / descanso", "5-20 min", "duration"]],
  mobility_pm_optional: [["stretching", "Movilidad", "5-10 min", "duration"]],
  weighted_walk_am: [["weighted walking", "Caminata con peso", "30-45 min", "duration_load"]],
  rest_or_swim_or_optional_weighted_walk: [["swimming freestyle", "Natacion o descanso", "suave", "duration"]],
};

let settings = JSON.parse(localStorage.getItem(STORE) || "{}");
let plan = null;
let state = null;
let todayWorkout = null;
let exerciseDb = [];

const $ = (id) => document.getElementById(id);
const today = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  return `${parts.find((p) => p.type === "year").value}-${parts.find((p) => p.type === "month").value}-${parts.find((p) => p.type === "day").value}`;
};
const weekdayKey = () =>
  new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "long" })
    .format(new Date())
    .toLowerCase();
const headers = () => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${settings.token}`,
  "X-GitHub-Api-Version": "2022-11-28",
});
const api = (path) =>
  `https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${path}`;
const toB64 = (text) => btoa(unescape(encodeURIComponent(text)));
const fromB64 = (text) => decodeURIComponent(escape(atob(text.replace(/\n/g, ""))));
const norm = (text) =>
  (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ");

function mediaFor(ex) {
  const query = norm(ex.lookup || ex.name);
  let best = null;
  let bestScore = 0;
  for (const rec of exerciseDb) {
    const name = norm(rec.name);
    let score = name.includes(query) ? 8 : 0;
    query.split(" ").filter(Boolean).forEach((part) => {
      if (name.includes(part)) score += 2;
    });
    if (score > bestScore) {
      best = rec;
      bestScore = score;
    }
  }
  return bestScore >= 4 && best?.gif_url ? MEDIA_BASE + best.gif_url : "";
}

function saveSettings(next) {
  settings = next;
  localStorage.setItem(STORE, JSON.stringify(settings));
}

async function getJson(path, fallback = null) {
  const res = await fetch(`${api(path)}?ref=${encodeURIComponent(settings.branch || "main")}`, {
    headers: headers(),
  });
  if (res.status === 404) return fallback;
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  const file = await res.json();
  return JSON.parse(fromB64(file.content));
}

async function putJson(path, obj, message) {
  let sha;
  const current = await fetch(`${api(path)}?ref=${encodeURIComponent(settings.branch || "main")}`, {
    headers: headers(),
  });
  if (current.ok) sha = (await current.json()).sha;
  const res = await fetch(api(path), {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      branch: settings.branch || "main",
      message,
      content: toB64(`${JSON.stringify(obj, null, 2)}\n`),
      sha,
    }),
  });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
}

function sessionExercises(id) {
  const names = plan?.strength_sessions?.[id];
  if (names) return names.map((name) => [name, ...(EX[name] || [name, "", "strength"])]);
  return SPECIAL[id] || [];
}

function plannedWorkout() {
  const ids = plan?.weekly_structure?.[weekdayKey()] || [];
  return {
    date: today(),
    timezone: TZ,
    session: "day",
    perceived_effort: "unknown",
    exercises: ids.flatMap((id, sessionIndex) =>
      sessionExercises(id).map(([lookup, name, target, kind]) => ({
        name,
        target,
        session: SESSION_META[id] || id,
        session_index: sessionIndex,
        done: false,
        lookup,
        exercise_kind: kind,
        ...(kind === "strength" ? { load_kg: null, sets: null, reps: null, rir: null } : {}),
        ...(kind === "duration" ? { duration_min: null } : {}),
        ...(kind === "duration_load" ? { load_kg: null, duration_min: null } : {}),
      })),
    ),
    notes: "",
    source: "public-pwa",
  };
}

function groupedExercises(workout) {
  return workout.exercises.reduce((groups, ex, index) => {
    const key = ex.session || "Sesion";
    groups[key] ||= [];
    groups[key].push([ex, index]);
    return groups;
  }, {});
}

function renderToday() {
  const root = $("today");
  if (!settings.token) {
    root.innerHTML = `<div class="card status bad">Configura GitHub en Settings primero.</div>`;
    return;
  }
  const workout = todayWorkout || plannedWorkout();
  root.innerHTML = `<div class="card"><div class="muted">${workout.date}</div><h2>Entrenamiento</h2><label>Esfuerzo percibido<select id="effort"><option value="unknown">Sin registrar</option><option value="easy">Facil</option><option value="moderate">Moderado</option><option value="hard">Dificil</option><option value="near_failure">Cerca del fallo</option></select></label></div>`;
  $("effort").value = workout.perceived_effort || "unknown";
  $("effort").onchange = (e) => (workout.perceived_effort = e.target.value);
  Object.entries(groupedExercises(workout)).forEach(([session, rows]) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${session}</h3>`;
    rows.forEach(([ex]) => card.append(exerciseRow(ex)));
    root.append(card);
  });
  const notes = document.createElement("div");
  notes.className = "card";
  notes.innerHTML = `<label>Notas<textarea id="workoutNotes"></textarea></label><div class="actions"><button class="btn" id="saveWorkout">Guardar en GitHub</button><button class="btn" id="resetWorkout">Recrear desde plan</button></div><div id="workoutStatus" class="status"></div>`;
  root.append(notes);
  $("workoutNotes").value = workout.notes || "";
  $("workoutNotes").oninput = (e) => (workout.notes = e.target.value);
  $("saveWorkout").onclick = () => saveWorkout(workout);
  $("resetWorkout").onclick = () => {
    todayWorkout = plannedWorkout();
    renderToday();
  };
}

function exerciseRow(ex) {
  const row = document.createElement("div");
  row.className = "row";
  const strength = ex.exercise_kind === "strength";
  const media = mediaFor(ex);
  row.innerHTML = `<div>${media ? `<img class="media" src="${media}" alt="${ex.name}" loading="lazy">` : ""}<div class="name">${ex.name}</div><div class="dose">${ex.target || ""}</div></div>`;
  if (strength) {
    row.innerHTML += `<input placeholder="kg" inputmode="decimal" value="${ex.load_kg ?? ""}"><input placeholder="reps" inputmode="numeric" value="${ex.reps ?? ""}"><select class="rir"><option value="">RIR</option><option>4</option><option>3</option><option>2</option><option>1</option><option>0</option></select>`;
    const [kg, reps, rir] = row.querySelectorAll("input,select");
    kg.oninput = (e) => (ex.load_kg = e.target.value === "" ? null : Number(e.target.value));
    reps.oninput = (e) => (ex.reps = e.target.value === "" ? null : Number(e.target.value));
    rir.value = ex.rir ?? "";
    rir.onchange = (e) => (ex.rir = e.target.value === "" ? null : Number(e.target.value));
  } else {
    row.innerHTML += `${ex.exercise_kind === "duration_load" ? `<input placeholder="kg" inputmode="decimal" value="${ex.load_kg ?? ""}">` : ""}<input placeholder="min" inputmode="numeric" value="${ex.duration_min ?? ""}">`;
    row.querySelectorAll("input").forEach((input) => {
      input.oninput = (e) => {
        const field = e.target.placeholder === "kg" ? "load_kg" : "duration_min";
        ex[field] = e.target.value === "" ? null : Number(e.target.value);
      };
    });
  }
  const done = document.createElement("label");
  done.className = "check";
  done.innerHTML = `<input type="checkbox" ${ex.done ? "checked" : ""}> hecho`;
  done.querySelector("input").onchange = (e) => (ex.done = e.target.checked);
  row.append(done);
  return row;
}

function renderFood() {
  $("food").innerHTML = `<div class="card"><div class="muted">${today()}</div><h2>Comida</h2><div class="grid"><label>Tipo<select id="mealType"><option>breakfast</option><option>lunch</option><option>dinner</option><option>snack</option><option>dessert</option></select></label><label>Hora aprox.<input id="mealTime" placeholder="13:30"></label></div><label>Items<textarea id="mealItems" placeholder="pollo 200g&#10;arroz 1 taza&#10;agua"></textarea></label><div class="grid"><label>Kcal aprox.<input id="mealKcal" inputmode="numeric"></label><label>Proteina g aprox.<input id="mealProtein" inputmode="numeric"></label></div><div class="actions"><button class="btn" id="saveMeal">Guardar comida</button></div><div id="mealStatus" class="status"></div></div>`;
  $("saveMeal").onclick = saveMeal;
}

function renderReport() {
  const latest = state?.latest_workout;
  $("report").innerHTML = `<div class="card"><h2>Ultimo sync</h2><div class="status">${state?.generated_at || "Sin snapshot cargado"}</div>${latest ? `<p><span class="pill">${latest.date}</span><span class="pill">${latest.perceived_effort || "unknown"}</span></p><div>${latest.exercises?.filter((x) => x.done).length || 0}/${latest.exercises?.length || 0} ejercicios hechos</div>` : ""}</div>`;
}

function renderSettings() {
  $("settings").innerHTML = `<div class="card"><h2>GitHub privado</h2><div class="grid"><label>Owner<input id="owner" value="${settings.owner || ""}"></label><label>Repo<input id="repo" value="${settings.repo || "personal-trainer"}"></label><label>Branch<input id="branch" value="${settings.branch || "main"}"></label><label>Token<input id="token" type="password" value="${settings.token || ""}"></label></div><div class="actions"><button class="btn" id="saveSettings">Guardar settings</button><button class="btn" id="loadData">Cargar datos</button></div><div id="settingsStatus" class="status"></div></div>`;
  $("saveSettings").onclick = () => {
    saveSettings({
      owner: $("owner").value.trim(),
      repo: $("repo").value.trim(),
      branch: $("branch").value.trim() || "main",
      token: $("token").value.trim(),
    });
    $("settingsStatus").textContent = "Settings guardados.";
  };
  $("loadData").onclick = loadData;
}

async function loadData() {
  const status = $("settingsStatus") || $("subtitle");
  try {
    status.textContent = "Cargando GitHub...";
    if (!exerciseDb.length) {
      exerciseDb = await fetch(DATA_URL).then((res) => (res.ok ? res.json() : []));
    }
    plan = await getJson("data/current-plan.json");
    state = await getJson("data/import/current-state.json", null);
    todayWorkout = await getJson(`data/import/workouts/${today()}.json`, null);
    status.textContent = "Datos cargados.";
    renderToday();
    renderReport();
  } catch (err) {
    status.textContent = err.message;
    status.classList.add("bad");
  }
}

async function saveWorkout(workout) {
  const status = $("workoutStatus");
  try {
    status.textContent = "Guardando...";
    await putJson(`data/import/workouts/${workout.date}.json`, workout, `Log workout ${workout.date}`);
    await saveCurrentState({ latest_workout: workout });
    status.textContent = "Guardado en GitHub.";
  } catch (err) {
    status.textContent = err.message;
    status.classList.add("bad");
  }
}

async function saveMeal() {
  const status = $("mealStatus");
  try {
    status.textContent = "Guardando...";
    const existing = await getJson(`data/nutrition/${today()}.json`, {
      date: today(),
      timezone: TZ,
      source: "public-pwa",
      meals: [],
      notes: "",
    });
    const meal = {
      meal: $("mealType").value,
      time_approx: $("mealTime").value || null,
      time_accuracy: $("mealTime").value ? "user_entered" : "unknown",
      items: $("mealItems").value.split("\n").filter(Boolean).map((name) => ({ name })),
      estimated_kcal: $("mealKcal").value ? Number($("mealKcal").value) : null,
      estimated_protein_g: $("mealProtein").value ? Number($("mealProtein").value) : null,
    };
    existing.meals.push(meal);
    await putJson(`data/nutrition/${today()}.json`, existing, `Log nutrition ${today()}`);
    await saveCurrentState({ latest_nutrition: existing });
    status.textContent = "Comida guardada en GitHub.";
  } catch (err) {
    status.textContent = err.message;
    status.classList.add("bad");
  }
}

async function saveCurrentState(patch) {
  const next = {
    ...(await getJson("data/import/current-state.json", {})),
    schema_version: 1,
    generated_at: new Date().toISOString(),
    timezone: TZ,
    source: "public-pwa",
    ...patch,
  };
  await putJson("data/import/current-state.json", next, `Update current trainer state ${today()}`);
  state = next;
  renderReport();
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.onclick = () => {
    document.querySelectorAll(".tab,.panel").forEach((el) => el.classList.remove("active"));
    tab.classList.add("active");
    $(tab.dataset.tab).classList.add("active");
  };
});

renderToday();
renderFood();
renderReport();
renderSettings();
if (settings.token) loadData();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(console.warn);
