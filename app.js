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
const WEEKDAYS = [
  ["monday", "Lunes"],
  ["tuesday", "Martes"],
  ["wednesday", "Miercoles"],
  ["thursday", "Jueves"],
  ["friday", "Viernes"],
  ["saturday", "Sabado"],
  ["sunday", "Domingo"],
];

let settings = JSON.parse(localStorage.getItem(STORE) || "{}");
let token = settings.token || sessionStorage.getItem("pt_session_token") || "";
let plan = null;
let state = null;
let todayWorkout = null;
let weekWorkouts = {};
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
function localDate(dateText) {
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}
function addDays(dateText, days) {
  const date = localDate(dateText);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
function weekDates() {
  const current = localDate(today());
  const mondayOffset = (current.getUTCDay() + 6) % 7;
  const monday = addDays(today(), -mondayOffset);
  return WEEKDAYS.map((day, index) => [...day, addDays(monday, index)]);
}
const headers = () => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
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

async function keyFromPassphrase(passphrase, salt) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

const bytesToB64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const b64ToBytes = (text) => Uint8Array.from(atob(text), (char) => char.charCodeAt(0));

async function encryptToken(rawToken, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFromPassphrase(passphrase, salt);
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(rawToken),
  );
  return { cipher: bytesToB64(cipher), salt: bytesToB64(salt), iv: bytesToB64(iv) };
}

async function unlockToken(passphrase) {
  const key = await keyFromPassphrase(passphrase, b64ToBytes(settings.token_salt));
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64ToBytes(settings.token_iv) },
    key,
    b64ToBytes(settings.token_cipher),
  );
  token = new TextDecoder().decode(plain);
  sessionStorage.setItem("pt_session_token", token);
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

async function putBase64(path, content, message) {
  let sha;
  const current = await fetch(`${api(path)}?ref=${encodeURIComponent(settings.branch || "main")}`, {
    headers: headers(),
  });
  if (current.ok) sha = (await current.json()).sha;
  const res = await fetch(api(path), {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({ branch: settings.branch || "main", message, content, sha }),
  });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
}

function imageToJpeg(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 1280 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.75).split(",")[1]);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
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
  if (!token) {
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

function renderWeek() {
  const root = $("week");
  if (!plan) {
    root.innerHTML = `<div class="card status">Carga datos desde Settings para ver el programa semanal.</div>`;
    return;
  }
  root.innerHTML = "";
  weekDates().forEach(([key, label, date]) => {
    const workout = weekWorkouts[date];
    const planned = plan.weekly_structure?.[key] || [];
    const completed = workout?.exercises?.filter((ex) => ex.done).length || 0;
    const total = workout?.exercises?.length || planned.flatMap(sessionExercises).length;
    const card = document.createElement("details");
    card.className = "card day-plan";
    card.open = date === today();
    card.innerHTML = `<summary><span><b>${label}</b><span class="muted"> ${date}</span></span><span class="pill">${workout ? `${completed}/${total} hechos` : "sin registro"}</span></summary>`;
    if (workout?.notes) {
      card.innerHTML += `<div class="status">${workout.notes}</div>`;
    }
    if (workout?.exercises?.length) {
      const done = document.createElement("div");
      done.innerHTML = `<h3>Registro</h3>`;
      Object.entries(groupedExercises(workout)).forEach(([session, rows]) => {
        done.innerHTML += `<h4>${session}</h4>`;
        rows.forEach(([ex]) => {
          const parts = [
            ex.done ? "hecho" : "pendiente",
            ex.load_kg != null ? `${ex.load_kg} kg` : "",
            ex.sets != null ? `${ex.sets} series` : "",
            ex.reps != null ? `${ex.reps} reps` : "",
            ex.duration_min != null ? `${ex.duration_min} min` : "",
            ex.rir != null ? `RIR ${ex.rir}` : "",
          ].filter(Boolean);
          done.innerHTML += `<div class="row compact-row"><div><div class="name">${ex.name}</div><div class="dose">${parts.join(" · ")}</div></div></div>`;
        });
      });
      card.append(done);
    }
    (plan.weekly_structure?.[key] || []).forEach((id) => {
      const session = document.createElement("div");
      session.innerHTML = `<h3>${SESSION_META[id] || id}</h3><div class="muted">${plan.session_notes?.[id] || ""}</div>`;
      sessionExercises(id).forEach(([lookup, name, target, kind]) => {
        const media = mediaFor({ lookup, name });
        session.innerHTML += `<div class="row compact-row"><div>${media ? `<img class="media" src="${media}" alt="${name}" loading="lazy">` : ""}<div class="name">${name}</div><div class="dose">${target || ""}</div><span class="pill">${kind}</span></div></div>`;
      });
      card.append(session);
    });
    root.append(card);
  });
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
  $("food").innerHTML = `<div class="card"><div class="muted">${today()}</div><h2>Comida</h2><div class="grid"><label>Tipo<select id="mealType"><option>breakfast</option><option>lunch</option><option>dinner</option><option>snack</option><option>dessert</option></select></label><label>Hora aprox.<input id="mealTime" placeholder="13:30"></label></div><label>Foto antes<input id="mealBefore" type="file" accept="image/*"></label><label>Foto despues opcional<input id="mealAfter" type="file" accept="image/*"></label><label>Items / descripcion<textarea id="mealItems" placeholder="pollo con arroz&#10;ensalada&#10;agua"></textarea></label><label>Notas para estimacion<textarea id="mealNotes" placeholder="Sobro media porcion. La foto despues muestra lo que no comi."></textarea></label><div class="card status">Las fotos se suben comprimidas al repo privado. Kcal y proteina quedan para estimacion posterior de ChatGPT.</div><div class="actions"><button class="btn" id="saveMeal">Guardar comida</button></div><div id="mealStatus" class="status"></div></div>`;
  $("saveMeal").onclick = saveMeal;
}

function renderReport() {
  const latest = state?.latest_workout;
  $("report").innerHTML = `<div class="card"><h2>Ultimo sync</h2><div class="status">${state?.generated_at || "Sin snapshot cargado"}</div>${latest ? `<p><span class="pill">${latest.date}</span><span class="pill">${latest.perceived_effort || "unknown"}</span></p><div>${latest.exercises?.filter((x) => x.done).length || 0}/${latest.exercises?.length || 0} ejercicios hechos</div>` : ""}</div>`;
}

function renderSettings() {
  $("settings").innerHTML = `<div class="card"><h2>GitHub privado</h2><div class="grid"><label>Owner<input id="owner" value="${settings.owner || ""}"></label><label>Repo<input id="repo" value="${settings.repo || "personal-trainer"}"></label><label>Branch<input id="branch" value="${settings.branch || "main"}"></label><label>Token<input id="token" type="password" placeholder="${settings.token_cipher ? "Token cifrado guardado" : ""}" value="${settings.token || ""}"></label><label>Passphrase local<input id="passphrase" type="password" placeholder="No se guarda"></label></div><div class="actions"><button class="btn" id="saveSettings">Guardar settings</button><button class="btn" id="unlockSettings">Desbloquear</button><button class="btn" id="loadData">Cargar datos</button></div><div id="settingsStatus" class="status"></div></div>`;
  $("saveSettings").onclick = async () => {
    const rawToken = $("token").value.trim();
    const passphrase = $("passphrase").value;
    const next = {
      owner: $("owner").value.trim(),
      repo: $("repo").value.trim(),
      branch: $("branch").value.trim() || "main",
    };
    if (rawToken && passphrase) {
      const encrypted = await encryptToken(rawToken, passphrase);
      Object.assign(next, {
        token_cipher: encrypted.cipher,
        token_salt: encrypted.salt,
        token_iv: encrypted.iv,
      });
      token = rawToken;
      sessionStorage.setItem("pt_session_token", token);
    } else if (rawToken) {
      next.token = rawToken;
      token = rawToken;
    } else if (settings.token_cipher) {
      Object.assign(next, {
        token_cipher: settings.token_cipher,
        token_salt: settings.token_salt,
        token_iv: settings.token_iv,
      });
    }
    saveSettings(next);
    $("settingsStatus").textContent = rawToken && passphrase ? "Settings guardados con token cifrado." : "Settings guardados.";
  };
  $("unlockSettings").onclick = async () => {
    try {
      await unlockToken($("passphrase").value);
      $("settingsStatus").textContent = "Token desbloqueado para esta sesion.";
    } catch {
      $("settingsStatus").textContent = "Passphrase incorrecta.";
      $("settingsStatus").classList.add("bad");
    }
  };
  $("loadData").onclick = loadData;
}

async function loadData() {
  const status = $("settingsStatus") || $("subtitle");
  try {
    if (!token) throw new Error("Desbloquea o guarda el token primero.");
    status.textContent = "Cargando GitHub...";
    if (!exerciseDb.length) {
      exerciseDb = await fetch(DATA_URL).then((res) => (res.ok ? res.json() : []));
    }
    plan = await getJson("data/current-plan.json");
    state = await getJson("data/import/current-state.json", null);
    todayWorkout = await getJson(`data/import/workouts/${today()}.json`, null);
    weekWorkouts = Object.fromEntries(
      await Promise.all(
        weekDates().map(async ([, , date]) => [
          date,
          await getJson(`data/import/workouts/${date}.json`, null),
        ]),
      ),
    );
    status.textContent = "Datos cargados.";
    renderToday();
    renderWeek();
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
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const photos = {};
    if ($("mealBefore").files[0]) {
      photos.before_path = `data/media/nutrition/${today()}/${stamp}-before.jpg`;
      await putBase64(
        photos.before_path,
        await imageToJpeg($("mealBefore").files[0]),
        `Upload meal before photo ${today()}`,
      );
    }
    if ($("mealAfter").files[0]) {
      photos.after_path = `data/media/nutrition/${today()}/${stamp}-after.jpg`;
      await putBase64(
        photos.after_path,
        await imageToJpeg($("mealAfter").files[0]),
        `Upload meal after photo ${today()}`,
      );
    }
    const meal = {
      meal: $("mealType").value,
      time_approx: $("mealTime").value || null,
      time_accuracy: $("mealTime").value ? "user_entered" : "unknown",
      items: $("mealItems").value.split("\n").filter(Boolean).map((name) => ({ name })),
      notes: $("mealNotes").value || null,
      photos,
      estimate_status: "pending_chatgpt",
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
renderWeek();
renderFood();
renderReport();
renderSettings();
if (settings.token) loadData();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(console.warn);
