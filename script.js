// Fuente: serie year,price_usd (3DS referencia).
const threeDSPriceUsdByYear = {
  2011: 249,
  2012: 169,
  2013: 169,
  2014: 169,
  2015: 199,
  2016: 199,
  2017: 149,
  2018: 129,
  2019: 119,
  2020: 140,
  2021: 160,
  2022: 180,
  2023: 200,
  2024: 220,
  2025: 240,
  2026: 260,
};

const amountInput = document.getElementById("amount");
const yearInput = document.getElementById("year");
const yearValue = document.getElementById("yearValue");
const referencePriceElement = document.getElementById("referencePrice");
const durationPerNekoInput = document.getElementById("durationPerNeko");
const durationPerNekoLabel = document.getElementById("durationPerNekoLabel");
const convertButton = document.getElementById("convertButton");
const resultElement = document.getElementById("result");
const timeEstimateElement = document.getElementById("timeEstimate");

const usdFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function getReferencePriceUsd() {
  const year = Number(yearInput.value);
  return threeDSPriceUsdByYear[year];
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
  const referencePrice = getReferencePriceUsd();
  yearValue.textContent = year;
  referencePriceElement.textContent = `${usdFormat.format(referencePrice)} USD`;
}

function updateDurationLabel() {
  const m = getMinutesPerNekomamada();
  durationPerNekoLabel.textContent = `1 nekomamada ${describeIntervalMinutes(m)}`;
}

function updateConversion() {
  updateYearUI();
  updateDurationLabel();

  const amount = Number(amountInput.value);
  const referencePrice = getReferencePriceUsd();
  const year = yearInput.value;
  const minutesPerNeko = getMinutesPerNekomamada();

  if (!amountInput.value || Number.isNaN(amount) || amount <= 0) {
    resultElement.textContent = "Ingresa un monto válido mayor a 0.";
    timeEstimateElement.textContent =
      "Ingresa un monto y ajusta el ritmo para ver cuánto tardarías en reunir ese dinero.";
    return;
  }

  const nekomamadas = amount / referencePrice;
  resultElement.textContent = `${usdFormat.format(amount)} en ${year} equivale a ${nekomamadas.toFixed(
    4
  )} nekomamadas.`;

  const totalMinutes = nekomamadas * minutesPerNeko;
  timeEstimateElement.textContent = `A este ritmo (${describeIntervalMinutes(
    minutesPerNeko
  )} por nekomamada) tardarías aproximadamente ${formatTotalMinutes(
    totalMinutes
  )} en conseguir ${usdFormat.format(amount)} (${nekomamadas.toFixed(4)} nekomamadas).`;
}

yearInput.addEventListener("input", updateConversion);
durationPerNekoInput.addEventListener("input", updateConversion);
amountInput.addEventListener("input", updateConversion);
convertButton.addEventListener("click", updateConversion);
amountInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    updateConversion();
  }
});

updateConversion();
