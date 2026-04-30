// Fuente: serie year,price_mxn (3DS referencia).
const threeDSPriceMxnByYear = {
  2011: 4233,
  2012: 2873,
  2013: 2873,
  2014: 2873,
  2015: 3383,
  2016: 3383,
  2017: 2533,
  2018: 2193,
  2019: 2023,
  2020: 2380,
  2021: 2720,
  2022: 3060,
  2023: 3400,
  2024: 3740,
  2025: 4080,
  2026: 4420,
};

const amountInput = document.getElementById("amount");
const yearInput = document.getElementById("year");
const yearValue = document.getElementById("yearValue");
const inputCurrencySelect = document.getElementById("inputCurrency");
const referencePriceElement = document.getElementById("referencePrice");
const fxInfoElement = document.getElementById("fxInfo");
const durationPerNekoInput = document.getElementById("durationPerNeko");
const durationPerNekoLabel = document.getElementById("durationPerNekoLabel");
const convertButton = document.getElementById("convertButton");
const resultElement = document.getElementById("result");
const timeEstimateElement = document.getElementById("timeEstimate");

const currencyConfig = {
  MXN: { locale: "es-MX", label: "MXN", mxnPerUnit: 1 },
  USD: { locale: "en-US", label: "USD", mxnPerUnit: 17.0 },
  EUR: { locale: "de-DE", label: "EUR", mxnPerUnit: 18.6 },
  GBP: { locale: "en-GB", label: "GBP", mxnPerUnit: 21.8 },
  JPY: { locale: "ja-JP", label: "JPY", mxnPerUnit: 0.115 },
  COP: { locale: "es-CO", label: "COP", mxnPerUnit: 0.0042 },
};

const mxnFormat = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

function getSelectedCurrency() {
  return inputCurrencySelect.value;
}

function formatMoney(amount, currencyCode) {
  const cfg = currencyConfig[currencyCode];
  return new Intl.NumberFormat(cfg.locale, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: currencyCode === "JPY" ? 0 : 2,
  }).format(amount);
}

function convertMxnToCurrency(amountMxn, currencyCode) {
  return amountMxn / currencyConfig[currencyCode].mxnPerUnit;
}

function convertCurrencyToMxn(amountCurrency, currencyCode) {
  return amountCurrency * currencyConfig[currencyCode].mxnPerUnit;
}

function referenceMxnForYear(yearNum) {
  return threeDSPriceMxnByYear[yearNum];
}

function getReferencePriceMxn() {
  return referenceMxnForYear(Number(yearInput.value));
}

function nekomamadasForMxn(amountMxn, refYear) {
  const p = referenceMxnForYear(refYear);
  if (!p || p <= 0) return NaN;
  return amountMxn / p;
}

function getMinutesPerNekomamada() {
  return Number(durationPerNekoInput.value);
}

/** Cómo se lee el ritmo: “cada X …” una nekomamada. */
function describeIntervalMinutes(minutes) {
  if (minutes < 60) {
    return `cada ${minutes} min`;
  }
  if (minutes % 1440 === 0) {
    const d = minutes / 1440;
    return `cada ${d} día${d !== 1 ? "s" : ""}`;
  }
  if (minutes % 60 === 0) {
    const h = minutes / 60;
    return `cada ${h} h`;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `cada ${h} h ${m} min`;
}

/** Tiempo total a partir de minutos (puede ser fracción). */
function formatTotalMinutes(totalMin) {
  if (totalMin < 1 / 60) {
    return "menos de 1 minuto";
  }
  const rounded = Math.round(totalMin);
  if (rounded < 60) {
    return `${rounded} minuto${rounded !== 1 ? "s" : ""}`;
  }
  const days = Math.floor(rounded / 1440);
  const hours = Math.floor((rounded % 1440) / 60);
  const mins = rounded % 60;
  const parts = [];
  if (days > 0) {
    parts.push(`${days} día${days !== 1 ? "s" : ""}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hora${hours !== 1 ? "s" : ""}`);
  }
  if (mins > 0 && days < 14) {
    parts.push(`${mins} minuto${mins !== 1 ? "s" : ""}`);
  }
  return parts.join(", ") || `${rounded} minutos`;
}

function updateYearUI() {
  const year = yearInput.value;
  const referencePriceMxn = getReferencePriceMxn();
  const currencyCode = getSelectedCurrency();
  const referenceInCurrency = convertMxnToCurrency(referencePriceMxn, currencyCode);
  const oneMxnInCurrency = convertMxnToCurrency(1, currencyCode);
  yearValue.textContent = year;
  referencePriceElement.textContent = `${formatMoney(referenceInCurrency, currencyCode)} (${mxnFormat.format(
    referencePriceMxn
  )})`;
  fxInfoElement.textContent = `Tipo de cambio usado: 1 ${currencyCode} = ${mxnFormat.format(
    currencyConfig[currencyCode].mxnPerUnit
  )} · 1 MXN = ${formatMoney(oneMxnInCurrency, currencyCode)}.`;
}

function updateDurationLabel() {
  const m = getMinutesPerNekomamada();
  durationPerNekoLabel.textContent = `1 nekomamada ${describeIntervalMinutes(m)}`;
}

function updateConversion() {
  updateYearUI();
  updateDurationLabel();

  const amount = Number(amountInput.value);
  const currencyCode = getSelectedCurrency();
  const referencePriceMxn = getReferencePriceMxn();
  const referencePriceInCurrency = convertMxnToCurrency(referencePriceMxn, currencyCode);
  const year = yearInput.value;
  const minutesPerNeko = getMinutesPerNekomamada();

  if (!amountInput.value || Number.isNaN(amount) || amount <= 0) {
    resultElement.textContent = "Ingresa un monto válido mayor a 0.";
    timeEstimateElement.textContent =
      "Ingresa un monto y ajusta el ritmo para ver cuánto tardarías en reunir ese dinero.";
    return;
  }

  const amountMxn = convertCurrencyToMxn(amount, currencyCode);
  const nekomamadas = amount / referencePriceInCurrency;
  resultElement.textContent = `${formatMoney(amount, currencyCode)} (${mxnFormat.format(
    amountMxn
  )}) en ${year} equivale a ${nekomamadas.toFixed(4)} nekomamadas (1 nekomamada = ${formatMoney(
    referencePriceInCurrency,
    currencyCode
  )}).`;

  const totalMinutes = nekomamadas * minutesPerNeko;
  timeEstimateElement.textContent = `A este ritmo (${describeIntervalMinutes(
    minutesPerNeko
  )} por nekomamada) tardarías aproximadamente ${formatTotalMinutes(
    totalMinutes
  )} en conseguir ${formatMoney(amount, currencyCode)} (${nekomamadas.toFixed(4)} nekomamadas).`;
}

yearInput.addEventListener("input", updateConversion);
inputCurrencySelect.addEventListener("input", updateConversion);
durationPerNekoInput.addEventListener("input", updateConversion);
amountInput.addEventListener("input", updateConversion);
convertButton.addEventListener("click", updateConversion);
amountInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    updateConversion();
  }
});

updateConversion();

/* —— Nekomamadas en la historia (localStorage) —— */
const HISTORY_STORAGE = "nekomamadas-history-v1";

const historyForm = document.getElementById("historyForm");
const histFact = document.getElementById("histFact");
const histAmount = document.getElementById("histAmount");
const histYear = document.getElementById("histYear");
const histSubmit = document.getElementById("histSubmit");
const histCancelEdit = document.getElementById("histCancelEdit");
const historyList = document.getElementById("historyList");
const toggleHistoryEditor = document.getElementById("toggleHistoryEditor");
const historyEditorPanel = document.getElementById("historyEditorPanel");
const historySection = document.querySelector(".history-section");

let editingHistoryId = null;
let isEditMode = false;

function initHistoryYearSelect() {
  histYear.innerHTML = "";
  Object.keys(threeDSPriceMxnByYear)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((y) => {
      const opt = document.createElement("option");
      opt.value = String(y);
      opt.textContent = String(y);
      histYear.appendChild(opt);
    });
  histYear.value = "2026";
}

function loadHistoryItems() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistoryItems(items) {
  localStorage.setItem(HISTORY_STORAGE, JSON.stringify(items));
}

function resetHistoryForm() {
  editingHistoryId = null;
  historyForm.reset();
  histYear.value = "2026";
  histSubmit.textContent = "Agregar noticia";
  histCancelEdit.classList.add("is-hidden");
}

function setEditMode(open) {
  isEditMode = open;
  historyEditorPanel.classList.toggle("is-hidden", !open);
  historySection.classList.toggle("edit-mode", open);
  toggleHistoryEditor.textContent = open ? "Desactivar modo editar" : "Activar modo editar";
}

function renderHistory() {
  const items = loadHistoryItems();
  historyList.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.className = "history-empty";
    empty.textContent =
      "Todavía no hay hechos. Usa el formulario para agregar el primero.";
    historyList.appendChild(empty);
    return;
  }

  const sorted = [...items].sort((a, b) => b.refYear - a.refYear || a.fact.localeCompare(b.fact));

  for (const item of sorted) {
    const li = document.createElement("li");
    li.className = "history-item";

    const neko = nekomamadasForMxn(item.amountMxn, item.refYear);
    const nekoStr = Number.isFinite(neko) ? neko.toFixed(4) : "—";
    const refP = referenceMxnForYear(item.refYear);

    const pFact = document.createElement("p");
    pFact.className = "history-item-fact";
    pFact.textContent = item.fact;

    const pDate = document.createElement("p");
    pDate.className = "history-item-date";
    pDate.textContent = `Año de referencia: ${item.refYear}`;

    const pMeta = document.createElement("p");
    pMeta.className = "history-item-meta";
    pMeta.textContent = `${mxnFormat.format(item.amountMxn)} · año ref. ${
      item.refYear
    } (3DS ${mxnFormat.format(refP)}) → ${nekoStr} nekomamadas`;

    const actions = document.createElement("div");
    actions.className = "history-item-actions";

    const btnEdit = document.createElement("button");
    btnEdit.type = "button";
    btnEdit.className = "btn-secondary btn-inline";
    btnEdit.textContent = "Editar";
    btnEdit.addEventListener("click", () => startEditHistory(item));

    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.className = "btn-danger btn-inline";
    btnDel.textContent = "Eliminar";
    btnDel.addEventListener("click", () => deleteHistoryItem(item.id));

    actions.append(btnEdit, btnDel);
    li.append(pFact, pDate, pMeta, actions);
    historyList.appendChild(li);
  }
}

function startEditHistory(item) {
  setEditMode(true);
  editingHistoryId = item.id;
  histFact.value = item.fact;
  histAmount.value = String(item.amountMxn);
  histYear.value = String(item.refYear);
  histSubmit.textContent = "Guardar cambios";
  histCancelEdit.classList.remove("is-hidden");
  histFact.focus();
}

function deleteHistoryItem(id) {
  if (!confirm("¿Seguro que quieres eliminar este hecho?")) return;
  const next = loadHistoryItems().filter((x) => x.id !== id);
  saveHistoryItems(next);
  if (editingHistoryId === id) {
    resetHistoryForm();
  }
  renderHistory();
}

historyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fact = histFact.value.trim();
  const amount = Number(histAmount.value);
  const refYear = Number(histYear.value);

  if (!fact || !histAmount.value || Number.isNaN(amount) || amount <= 0) {
    alert("Completa el hecho y un monto en MXN mayor a 0.");
    return;
  }

  const items = loadHistoryItems();

  if (editingHistoryId) {
    const idx = items.findIndex((x) => x.id === editingHistoryId);
    if (idx === -1) {
      resetHistoryForm();
      renderHistory();
      return;
    }
    items[idx] = { ...items[idx], fact, amountMxn: amount, refYear };
    saveHistoryItems(items);
    resetHistoryForm();
    setEditMode(false);
    renderHistory();
    return;
  }

  items.push({
    id: crypto.randomUUID(),
    fact,
    amountMxn: amount,
    refYear,
  });
  saveHistoryItems(items);
  resetHistoryForm();
  setEditMode(false);
  renderHistory();
});

histCancelEdit.addEventListener("click", () => {
  resetHistoryForm();
  setEditMode(false);
});

toggleHistoryEditor.addEventListener("click", () => {
  setEditMode(!isEditMode);
});

initHistoryYearSelect();
setEditMode(false);
renderHistory();
