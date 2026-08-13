const STORE = "pt_public_pwa_settings";
const TZ = "America/Lima";
const DATA_URL = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json";
const MEDIA_BASE = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/";
const TEXT = {
  es: {
    today: "Hoy",
    week: "Semana",
    food: "Comida",
    report: "Reporte",
    settings: "Settings",
    subtitle: "PWA publica, datos privados en GitHub",
    privateGithub: "GitHub privado",
    owner: "Owner",
    repo: "Repo",
    branch: "Branch",
    token: "Token",
    passphrase: "Passphrase local",
    preferences: "Preferencias",
    palette: "Paleta",
    language: "Idioma",
    saveSettings: "Guardar settings",
    unlock: "Desbloquear",
    loadData: "Cargar datos",
    unlockSessionTitle: "Desbloquear datos",
    unlockSessionBody: "Hay un token cifrado guardado en este dispositivo. Ingresa tu passphrase para desbloquearlo solo durante esta sesion.",
    unlockAndLoad: "Desbloquear y cargar datos",
    skipUnlock: "Ahora no",
    faqTitle: "Como funciona el token",
    faqBody:
      "La app publica no contiene tus datos. Lee y escribe el repo privado solo cuando este navegador tiene tu PAT. Si usas passphrase, el PAT queda cifrado en localStorage y se desbloquea solo para esta sesion. La passphrase no se guarda.",
    tokenSaved: "Token cifrado guardado",
    notSaved: "No se guarda",
    savedEncrypted: "Settings guardados con token cifrado.",
    saved: "Settings guardados.",
    unlocked: "Token desbloqueado para esta sesion.",
    badPassphrase: "Passphrase incorrecta.",
    unlockFirst: "Desbloquea el token en Settings para cargar tus datos.",
    configureFirst: "Configura GitHub en Settings primero.",
    tokenNeedsPassphrase: "Ingresa una passphrase para guardar o cifrar el token.",
    plainTokenWarning: "Hay un token guardado sin cifrar. Ingresa una passphrase y guarda Settings para cifrarlo.",
    partialLanguage: "Idioma parcial: cambian las etiquetas principales; los datos y nombres del plan se conservan como fueron guardados.",
    loadingGithub: "Cargando GitHub...",
    dataLoaded: "Datos cargados.",
    mealSaved: "Comida guardada en GitHub.",
    newMeal: "Nueva comida",
    editingMeal: "Editando",
    cancelEdit: "Cancelar edición",
    saveMeal: "Guardar comida",
    saveChanges: "Guardar cambios",
    weekScope: "Semana visible",
    pendingForChatGPT: "Pendiente para ChatGPT",
    noPending: "No hay comidas pendientes en la semana visible.",
    copyPrompt: "Copiar pedido",
    promptCopied: "Pedido copiado.",
  },
  en: {
    today: "Today",
    week: "Week",
    food: "Food",
    report: "Report",
    settings: "Settings",
    subtitle: "Public PWA, private data in GitHub",
    privateGithub: "Private GitHub",
    owner: "Owner",
    repo: "Repo",
    branch: "Branch",
    token: "Token",
    passphrase: "Local passphrase",
    preferences: "Preferences",
    palette: "Palette",
    language: "Language",
    saveSettings: "Save settings",
    unlock: "Unlock",
    loadData: "Load data",
    unlockSessionTitle: "Unlock data",
    unlockSessionBody: "An encrypted token is saved on this device. Enter your passphrase to unlock it only for this session.",
    unlockAndLoad: "Unlock and load data",
    skipUnlock: "Not now",
    faqTitle: "How token security works",
    faqBody:
      "The public app does not include your data. It reads and writes the private repo only when this browser has your PAT. With a passphrase, the PAT is encrypted in localStorage and unlocked only for this session. The passphrase is not stored.",
    tokenSaved: "Encrypted token saved",
    notSaved: "Not stored",
    savedEncrypted: "Settings saved with encrypted token.",
    saved: "Settings saved.",
    unlocked: "Token unlocked for this session.",
    badPassphrase: "Wrong passphrase.",
    unlockFirst: "Unlock the token in Settings to load your data.",
    configureFirst: "Configure GitHub in Settings first.",
    tokenNeedsPassphrase: "Enter a passphrase to save or encrypt the token.",
    plainTokenWarning: "A token is stored without encryption. Enter a passphrase and save Settings to encrypt it.",
    partialLanguage: "Partial language: main labels change; saved data and plan names stay as stored.",
    loadingGithub: "Loading GitHub...",
    dataLoaded: "Data loaded.",
    mealSaved: "Meal saved to GitHub.",
    newMeal: "New meal",
    editingMeal: "Editing",
    cancelEdit: "Cancel edit",
    saveMeal: "Save meal",
    saveChanges: "Save changes",
    weekScope: "Visible week",
    pendingForChatGPT: "Pending for ChatGPT",
    noPending: "No pending meals in the visible week.",
    copyPrompt: "Copy request",
    promptCopied: "Request copied.",
  },
};
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
const MEAL_TYPES = [
  ["breakfast", "Desayuno", "Breakfast"],
  ["lunch", "Almuerzo", "Lunch"],
  ["dinner", "Cena", "Dinner"],
  ["snack", "Snack", "Snack"],
  ["dessert", "Postre", "Dessert"],
];
const TIME_HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1));
const TIME_MINUTES = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));

let settings = JSON.parse(localStorage.getItem(STORE) || "{}");
let token = settings.token || sessionStorage.getItem("pt_session_token") || "";
let plan = null;
let state = null;
let todayWorkout = null;
let weekWorkouts = {};
let weekNutrition = {};
let exerciseDb = [];
let visibleWeekStart = null;
let activeWorkoutDate = null;

const $ = (id) => document.getElementById(id);
const tr = (key) => TEXT[settings.language || "es"]?.[key] || TEXT.es[key] || key;
const today = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  return `${parts.find((p) => p.type === "year").value}-${parts.find((p) => p.type === "month").value}-${parts.find((p) => p.type === "day").value}`;
};
function weekdayKeyFor(dateText) {
  return WEEKDAYS[(localDate(dateText).getUTCDay() + 6) % 7][0];
}
function localDate(dateText) {
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}
function addDays(dateText, days) {
  const date = localDate(dateText);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
function currentWeekStart() {
  const current = localDate(today());
  const mondayOffset = (current.getUTCDay() + 6) % 7;
  return addDays(today(), -mondayOffset);
}
function weekDates() {
  const monday = visibleWeekStart || currentWeekStart();
  return WEEKDAYS.map((day, index) => [...day, addDays(monday, index)]);
}
function weekNavHtml() {
  const dates = weekDates();
  return `<div class="week-nav"><button class="btn" data-week-shift="-7">‹</button><div><b>${dates[0][2]}</b><div class="muted">al ${dates[6][2]}</div></div><button class="btn" data-week-shift="7">›</button><button class="btn" data-week-today="1">Hoy</button></div>`;
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
  applyPreferences();
}

function renderAll() {
  renderToday();
  renderWeek();
  renderFood();
  renderReport();
  renderSettings();
}

function savePreference(key, value) {
  saveSettings({ ...settings, [key]: value });
  renderAll();
}

function applyPreferences() {
  document.documentElement.dataset.palette = settings.palette || "dark";
  document.documentElement.lang = settings.language || "es";
  $("subtitle").textContent = tr("subtitle");
  $("unlockTitle").textContent = tr("unlockSessionTitle");
  $("unlockBody").textContent = tr("unlockSessionBody");
  $("unlockAndLoad").textContent = tr("unlockAndLoad");
  $("skipUnlock").textContent = tr("skipUnlock");
  document.querySelectorAll("[data-label]").forEach((node) => {
    node.textContent = tr(node.dataset.label);
  });
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

function showUnlockDialog() {
  const dialog = $("unlockDialog");
  if (!settings.token_cipher || token || !dialog || dialog.open) return;
  $("unlockPassphrase").value = "";
  $("unlockDialogStatus").textContent = "";
  dialog.showModal();
  $("unlockPassphrase").focus();
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

function renderPhotoPreview(inputId, previewId) {
  const preview = $(previewId);
  if (!preview) return;
  preview.innerHTML = "";
  Array.from($(inputId).files || []).forEach((file) => {
    const url = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.src = url;
    img.alt = file.name;
    img.onload = () => URL.revokeObjectURL(url);
    preview.append(img);
  });
}

function sessionExercises(id) {
  const names = plan?.strength_sessions?.[id];
  if (names) return names.map((name) => [name, ...(EX[name] || [name, "", "strength"])]);
  return SPECIAL[id] || [];
}

function plannedWorkout(dateText = today()) {
  const ids = plan?.weekly_structure?.[weekdayKeyFor(dateText)] || [];
  return {
    date: dateText,
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
    root.innerHTML = `<div class="card status bad">${settings.token_cipher ? tr("unlockFirst") : tr("configureFirst")}</div>`;
    return;
  }
  const date = activeWorkoutDate || today();
  const workout = date === today() ? todayWorkout || plannedWorkout(date) : weekWorkouts[date] || plannedWorkout(date);
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
    const next = plannedWorkout(date);
    if (date === today()) todayWorkout = next;
    else weekWorkouts[date] = next;
    renderToday();
  };
}

function renderWeek() {
  const root = $("week");
  if (!plan) {
    root.innerHTML = `<div class="card status">Carga datos desde Settings para ver el programa semanal.</div>`;
    return;
  }
  root.innerHTML = weekNavHtml();
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
    card.innerHTML += `<div class="actions"><button class="btn mini" data-workout="${date}">${workout ? "Editar registro" : "Registrar dia"}</button></div>`;
    root.append(card);
  });
  root.querySelectorAll("[data-workout]").forEach((button) => {
    button.onclick = () => editWorkout(button.dataset.workout);
  });
  bindWeekNav(root);
}

function editWorkout(date) {
  activeWorkoutDate = date;
  renderToday();
  activateTab("today");
  $("today").scrollIntoView({ behavior: "smooth", block: "start" });
}

function exerciseRow(ex) {
  const row = document.createElement("div");
  row.className = "row";
  const strength = ex.exercise_kind === "strength";
  const media = mediaFor(ex);
  row.innerHTML = `<div>${media ? `<img class="media" src="${media}" alt="${ex.name}" loading="lazy">` : ""}<div class="name">${ex.name}</div><div class="dose">${ex.target || ""}</div></div>`;
  if (strength) {
    row.innerHTML += `<input placeholder="kg" inputmode="decimal" value="${ex.load_kg ?? ""}"><input placeholder="sets" inputmode="numeric" value="${ex.sets ?? ""}"><input placeholder="reps" inputmode="numeric" value="${ex.reps ?? ""}"><select class="rir"><option value="">RIR</option><option>4</option><option>3</option><option>2</option><option>1</option><option>0</option></select>`;
    const [kg, sets, reps, rir] = row.querySelectorAll("input,select");
    kg.oninput = (e) => (ex.load_kg = e.target.value === "" ? null : Number(e.target.value));
    sets.oninput = (e) => (ex.sets = e.target.value === "" ? null : Number(e.target.value));
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
  const mealOptions = MEAL_TYPES.map(
    ([value, es, en]) => `<option value="${value}">${settings.language === "en" ? en : es}</option>`,
  ).join("");
  const hourOptions = TIME_HOURS.map((hour) => `<option value="${hour}">${hour}</option>`).join("");
  const minuteOptions = TIME_MINUTES.map((minute) => `<option value="${minute}">${minute}</option>`).join("");
  $("food").innerHTML = `${weekNavHtml()}<div id="foodWeek"></div><div class="card" id="mealForm"><div class="edit-banner"><div><div class="muted" id="mealEditingDate">${tr("newMeal")}</div><div id="mealEditingSummary" class="status"></div></div><button class="btn mini hide" id="cancelMealEdit">${tr("cancelEdit")}</button></div><h2>${tr("food")}</h2><input id="mealEditIndex" type="hidden"><div class="grid"><label>Fecha<input id="mealDate" type="date" value="${today()}"></label><label>Tipo<select id="mealType">${mealOptions}</select></label><div class="time-picker"><div class="muted">Hora aprox. (12-hour)</div><select id="mealHour"><option value="">Hora</option>${hourOptions}</select><select id="mealMinute"><option value="">Min</option>${minuteOptions}</select><select id="mealPeriod"><option value="">AM/PM</option><option>AM</option><option>PM</option></select></div></div><div class="photo-actions"><label class="photo-btn">Fotos antes<input id="mealBefore" type="file" accept="image/*" multiple></label><label class="photo-btn optional">Foto despues<input id="mealAfter" type="file" accept="image/*"></label></div><div class="photo-preview" id="mealBeforePreview"></div><div class="photo-preview" id="mealAfterPreview"></div><label>Items / descripcion<textarea id="mealItems" placeholder="pollo con arroz&#10;ensalada&#10;agua"></textarea></label><label>Notas para estimacion<textarea id="mealNotes" placeholder="Sobro media porcion. La foto despues muestra lo que no comi."></textarea></label><div class="card status">Vista semanal en lectura. Usa Editar solo para corregir una entrada. Kcal y proteina quedan para ChatGPT.</div><div class="actions"><button class="btn" id="saveMeal">${tr("saveMeal")}</button><button class="btn" id="newMeal">${tr("newMeal")}</button></div><div id="mealStatus" class="status"></div></div>`;
  $("saveMeal").onclick = saveMeal;
  $("newMeal").onclick = clearMealForm;
  $("cancelMealEdit").onclick = clearMealForm;
  $("mealBefore").onchange = () => renderPhotoPreview("mealBefore", "mealBeforePreview");
  $("mealAfter").onchange = () => renderPhotoPreview("mealAfter", "mealAfterPreview");
  renderFoodWeek();
  bindWeekNav($("food"));
}

function mealLabel(value) {
  const meal = MEAL_TYPES.find(([key]) => key === value);
  return meal ? meal[settings.language === "en" ? 2 : 1] : value || tr("food");
}

function parseMealTime(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return { hour: "", minute: "", period: "" };
  let hour = Number(match[1]);
  const minute = match[2];
  let period = match[3]?.toUpperCase();
  if (!period) {
    period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
  }
  return { hour: String(hour), minute, period };
}

function setMealTime(value) {
  const time = parseMealTime(value);
  $("mealHour").value = time.hour;
  $("mealMinute").value = time.minute;
  $("mealPeriod").value = time.period;
}

function mealTimeValue() {
  const hour = $("mealHour").value;
  const minute = $("mealMinute").value;
  const period = $("mealPeriod").value;
  return hour && minute && period ? `${hour}:${minute} ${period}` : null;
}

function clearMealForm() {
  $("mealEditingDate").textContent = tr("newMeal");
  $("mealEditingSummary").textContent = "";
  $("mealDate").value = today();
  $("mealEditIndex").value = "";
  $("mealType").value = "breakfast";
  setMealTime("");
  $("mealBefore").value = "";
  $("mealAfter").value = "";
  $("mealBeforePreview").innerHTML = "";
  $("mealAfterPreview").innerHTML = "";
  $("mealItems").value = "";
  $("mealNotes").value = "";
  $("saveMeal").textContent = tr("saveMeal");
  $("cancelMealEdit").classList.add("hide");
  $("mealStatus").textContent = "";
}

function editMeal(date, index) {
  const meal = weekNutrition[date]?.meals?.[index];
  if (!meal) return;
  $("mealEditingDate").textContent = `${tr("editingMeal")} ${date}`;
  $("mealEditingSummary").textContent = `${mealLabel(meal.meal)} ${meal.time_approx || ""}`.trim();
  $("mealDate").value = date;
  $("mealEditIndex").value = index;
  $("mealType").value = meal.meal || "breakfast";
  setMealTime(meal.time_approx || "");
  $("mealItems").value = (meal.items || []).map((item) => item.name || "").join("\n");
  $("mealNotes").value = meal.notes || "";
  $("mealBefore").value = "";
  $("mealAfter").value = "";
  $("mealBeforePreview").innerHTML = "";
  $("mealAfterPreview").innerHTML = "";
  $("saveMeal").textContent = tr("saveChanges");
  $("cancelMealEdit").classList.remove("hide");
  $("mealStatus").textContent = "Editando comida existente. Las fotos actuales se conservan si no subes nuevas.";
  $("mealForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderFoodWeek() {
  const root = $("foodWeek");
  root.innerHTML = "";
  weekDates().forEach(([, label, date]) => {
    const nutrition = weekNutrition[date];
    const meals = nutrition?.meals || [];
    const card = document.createElement("details");
    card.className = "card day-plan";
    card.open = date === today();
    card.innerHTML = `<summary><span><b>${label}</b><span class="muted"> ${date}</span></span><span class="pill">${meals.length ? `${meals.length} comidas` : "sin registro"}</span></summary>`;
    meals.forEach((meal, index) => {
      const items = (meal.items || []).map((item) => item.name).filter(Boolean).join(", ");
      const beforeCount = meal.photos?.before_paths?.length || (meal.photos?.before_path ? 1 : 0);
      const photos = meal.photos
        ? [beforeCount ? `${beforeCount} foto${beforeCount > 1 ? "s" : ""} antes` : "", meal.photos.after_path ? "foto despues" : ""].filter(Boolean).join(" · ")
        : "";
      card.innerHTML += `<div class="meal-read"><div><div class="name">${mealLabel(meal.meal)} ${meal.time_approx || ""}</div><div class="dose">${items || "Sin descripcion"}</div>${meal.notes ? `<div class="muted">${meal.notes}</div>` : ""}${photos ? `<div class="muted">${photos}</div>` : ""}</div><button class="btn mini" data-meal="${date}:${index}">Editar</button></div>`;
    });
    root.append(card);
  });
  root.querySelectorAll("[data-meal]").forEach((button) => {
    button.onclick = () => {
      const [date, index] = button.dataset.meal.split(":");
      editMeal(date, Number(index));
    };
  });
}

function bindWeekNav(root) {
  root.querySelectorAll("[data-week-shift]").forEach((button) => {
    button.onclick = () => changeWeek(Number(button.dataset.weekShift));
  });
  root.querySelectorAll("[data-week-today]").forEach((button) => {
    button.onclick = () => changeWeek(0, true);
  });
}

function pendingMeals() {
  return Object.entries(weekNutrition).flatMap(([date, day]) =>
    (day?.meals || [])
      .map((meal, index) => ({ date, meal, index }))
      .filter(({ meal }) => meal.estimate_status === "pending_chatgpt"),
  );
}

function renderReport() {
  const latest = state?.latest_workout;
  const pending = pendingMeals();
  const prompt = "procesa comidas pendientes";
  const dates = weekDates();
  $("report").innerHTML = `${weekNavHtml()}<div class="card"><h2>Ultimo sync</h2><div class="status">${state?.generated_at || "Sin snapshot cargado"}</div>${latest ? `<p><span class="pill">${latest.date}</span><span class="pill">${latest.perceived_effort || "unknown"}</span></p><div>${latest.exercises?.filter((x) => x.done).length || 0}/${latest.exercises?.length || 0} ejercicios hechos</div>` : ""}</div><div class="card"><h2>${tr("pendingForChatGPT")}</h2><div class="status">${tr("weekScope")}: ${dates[0][2]} al ${dates[6][2]}</div><p><span class="pill">${pending.length} comidas</span></p>${pending.length ? pending.map(({ date, meal }) => `<div class="meal-read"><div><div class="name">${date} · ${mealLabel(meal.meal)} ${meal.time_approx || ""}</div><div class="dose">${(meal.items || []).map((item) => item.name).filter(Boolean).join(", ") || "Sin descripcion"}</div><div class="muted">${meal.photos?.before_path ? "foto antes" : "sin foto antes"}${meal.photos?.after_path ? " · foto despues" : ""}</div></div></div>`).join("") : `<div class="status">${tr("noPending")}</div>`}<div class="actions"><button class="btn" id="copyPendingPrompt">${tr("copyPrompt")}</button></div><div class="status">Pedido: <code>${prompt}</code></div><div id="copyStatus" class="status"></div></div>`;
  bindWeekNav($("report"));
  $("copyPendingPrompt").onclick = async () => {
    await navigator.clipboard.writeText(prompt);
    $("copyStatus").textContent = tr("promptCopied");
  };
}

function renderSettings() {
  $("settings").innerHTML = `<div class="card"><h2>${tr("privateGithub")}</h2>${settings.token ? `<div class="status bad">${tr("plainTokenWarning")}</div>` : ""}<div class="grid"><label>${tr("owner")}<input id="owner" value="${settings.owner || ""}"></label><label>${tr("repo")}<input id="repo" value="${settings.repo || "personal-trainer"}"></label><label>${tr("branch")}<input id="branch" value="${settings.branch || "main"}"></label><label>${tr("token")}<input id="token" type="password" placeholder="${settings.token_cipher ? tr("tokenSaved") : ""}" value=""></label><label>${tr("passphrase")}<input id="passphrase" type="password" placeholder="${tr("notSaved")}"></label></div><details class="faq"><summary><span class="info-icon">i</span>${tr("faqTitle")}</summary><p>${tr("faqBody")}</p></details><h2>${tr("preferences")}</h2><div class="grid"><label>${tr("palette")}<select id="palette"><option value="dark">Dark</option><option value="light">Light</option><option value="forest">Forest</option></select></label><label>${tr("language")}<select id="language"><option value="es">Espanol</option><option value="en">English</option></select></label></div><div class="status">${tr("partialLanguage")}</div><div class="actions"><button class="btn" id="saveSettings">${tr("saveSettings")}</button><button class="btn" id="unlockSettings">${tr("unlock")}</button><button class="btn" id="loadData">${tr("loadData")}</button></div><div id="settingsStatus" class="status"></div></div>`;
  $("palette").value = settings.palette || "dark";
  $("language").value = settings.language || "es";
  $("palette").onchange = (e) => savePreference("palette", e.target.value);
  $("language").onchange = (e) => savePreference("language", e.target.value);
  $("saveSettings").onclick = async () => {
    const rawToken = $("token").value.trim();
    const passphrase = $("passphrase").value;
    const next = {
      owner: $("owner").value.trim(),
      repo: $("repo").value.trim(),
      branch: $("branch").value.trim() || "main",
      palette: $("palette").value,
      language: $("language").value,
    };
    const willEncryptToken = !!((rawToken || settings.token) && passphrase);
    if (rawToken && !passphrase) {
      $("settingsStatus").textContent = tr("tokenNeedsPassphrase");
      $("settingsStatus").classList.add("bad");
      return;
    }
    if (willEncryptToken) {
      const encrypted = await encryptToken(rawToken || settings.token, passphrase);
      Object.assign(next, {
        token_cipher: encrypted.cipher,
        token_salt: encrypted.salt,
        token_iv: encrypted.iv,
      });
      token = rawToken || settings.token;
      sessionStorage.setItem("pt_session_token", token);
    } else if (settings.token_cipher) {
      Object.assign(next, {
        token_cipher: settings.token_cipher,
        token_salt: settings.token_salt,
        token_iv: settings.token_iv,
      });
    } else if (settings.token) {
      next.token = settings.token;
    }
    saveSettings(next);
    renderAll();
    $("settingsStatus").textContent = willEncryptToken ? tr("savedEncrypted") : tr("saved");
  };
  $("unlockSettings").onclick = async () => {
    try {
      await unlockToken($("passphrase").value);
      $("settingsStatus").textContent = tr("unlocked");
    } catch {
      $("settingsStatus").textContent = tr("badPassphrase");
      $("settingsStatus").classList.add("bad");
    }
  };
  $("loadData").onclick = loadData;
}

async function loadVisibleWeek() {
  weekWorkouts = Object.fromEntries(
    await Promise.all(
      weekDates().map(async ([, , date]) => [
        date,
        await getJson(`data/import/workouts/${date}.json`, null),
      ]),
    ),
  );
  weekNutrition = Object.fromEntries(
    await Promise.all(
      weekDates().map(async ([, , date]) => [
        date,
        await getJson(`data/nutrition/${date}.json`, null),
      ]),
    ),
  );
}

async function changeWeek(days, reset = false) {
  if (!token) return;
  visibleWeekStart = reset ? currentWeekStart() : addDays(visibleWeekStart || currentWeekStart(), days);
  await loadVisibleWeek();
  renderWeek();
  renderFood();
  renderReport();
}

async function loadData() {
  const status = $("settingsStatus") || $("subtitle");
  try {
    if (!token) throw new Error("Desbloquea o guarda el token primero.");
    status.textContent = tr("loadingGithub");
    if (!exerciseDb.length) {
      exerciseDb = await fetch(DATA_URL).then((res) => (res.ok ? res.json() : []));
    }
    visibleWeekStart ||= currentWeekStart();
    plan = await getJson("data/current-plan.json");
    state = await getJson("data/import/current-state.json", null);
    todayWorkout = await getJson(`data/import/workouts/${today()}.json`, null);
    await loadVisibleWeek();
    status.textContent = tr("dataLoaded");
    renderToday();
    renderWeek();
    renderFood();
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
    weekWorkouts[workout.date] = workout;
    if (workout.date === today()) todayWorkout = workout;
    renderWeek();
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
    const date = $("mealDate").value || today();
    const editIndex = $("mealEditIndex").value === "" ? -1 : Number($("mealEditIndex").value);
    const existing = await getJson(`data/nutrition/${date}.json`, {
      date,
      timezone: TZ,
      source: "public-pwa",
      meals: [],
      notes: "",
    });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const photos = editIndex >= 0 ? { ...(existing.meals[editIndex]?.photos || {}) } : {};
    const beforeFiles = Array.from($("mealBefore").files || []);
    if (beforeFiles.length) {
      photos.before_paths = [];
      for (const [index, file] of beforeFiles.entries()) {
        const path = `data/media/nutrition/${date}/${stamp}-before-${index + 1}.jpg`;
        await putBase64(path, await imageToJpeg(file), `Upload meal before photo ${date}`);
        photos.before_paths.push(path);
      }
      photos.before_path = photos.before_paths[0];
    }
    if ($("mealAfter").files[0]) {
      photos.after_path = `data/media/nutrition/${date}/${stamp}-after.jpg`;
      await putBase64(
        photos.after_path,
        await imageToJpeg($("mealAfter").files[0]),
        `Upload meal after photo ${date}`,
      );
    }
    const timeApprox = mealTimeValue();
    const meal = {
      ...(editIndex >= 0 ? existing.meals[editIndex] || {} : {}),
      meal: $("mealType").value,
      time_approx: timeApprox,
      time_accuracy: timeApprox ? "user_entered" : "unknown",
      items: $("mealItems").value.split("\n").filter(Boolean).map((name) => ({ name })),
      notes: $("mealNotes").value || null,
      photos,
      estimate_status: "pending_chatgpt",
    };
    if (editIndex >= 0) existing.meals[editIndex] = meal;
    else existing.meals.push(meal);
    await putJson(`data/nutrition/${date}.json`, existing, `Log nutrition ${date}`);
    await saveCurrentState({ latest_nutrition: existing });
    weekNutrition[date] = existing;
    renderFood();
    $("mealStatus").textContent = "Comida guardada en GitHub.";
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

function activateTab(id) {
  document.querySelectorAll(".tab,.panel").forEach((el) => el.classList.remove("active"));
  document.querySelector(`[data-tab="${id}"]`).classList.add("active");
  $(id).classList.add("active");
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.onclick = () => activateTab(tab.dataset.tab);
});

$("skipUnlock").onclick = () => $("unlockDialog").close();
$("unlockAndLoad").onclick = async () => {
  const status = $("unlockDialogStatus");
  try {
    status.textContent = tr("loadingGithub");
    status.classList.remove("bad");
    await unlockToken($("unlockPassphrase").value);
    $("unlockDialog").close();
    await loadData();
  } catch {
    status.textContent = tr("badPassphrase");
    status.classList.add("bad");
  }
};
$("unlockPassphrase").onkeydown = (event) => {
  if (event.key === "Enter") $("unlockAndLoad").click();
};

applyPreferences();
renderAll();
if (token) loadData();
else showUnlockDialog();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(console.warn);
