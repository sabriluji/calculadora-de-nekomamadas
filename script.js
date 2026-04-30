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
};

const amountInput = document.getElementById("amount");
const yearInput = document.getElementById("year");
const yearValue = document.getElementById("yearValue");
const referencePriceElement = document.getElementById("referencePrice");
const convertButton = document.getElementById("convertButton");
const resultElement = document.getElementById("result");

const usdFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function getReferencePriceUsd() {
  const year = Number(yearInput.value);
  return threeDSPriceUsdByYear[year];
}

function updateYearUI() {
  const year = yearInput.value;
  const referencePrice = getReferencePriceUsd();
  yearValue.textContent = year;
  referencePriceElement.textContent = `${usdFormat.format(referencePrice)} USD`;
}

function convertToNekomamadas() {
  const amount = Number(amountInput.value);
  const referencePrice = getReferencePriceUsd();
  const year = yearInput.value;

  if (!amountInput.value || Number.isNaN(amount) || amount <= 0) {
    resultElement.textContent = "Ingresa un monto válido mayor a 0.";
    return;
  }

  const nekomamadas = amount / referencePrice;
  resultElement.textContent = `${usdFormat.format(amount)} en ${year} equivale a ${nekomamadas.toFixed(
    4
  )} nekomamadas.`;
}

yearInput.addEventListener("input", updateYearUI);
convertButton.addEventListener("click", convertToNekomamadas);
amountInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    convertToNekomamadas();
  }
});

updateYearUI();
