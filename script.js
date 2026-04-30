// Precios de referencia MXN (MSRP / retail típico en México, estimados).
// Tras el fin de venta oficial (~2020) se congela el último precio típico.
const threeDSPriceByYear = {
  2017: 5499,
  2018: 4999,
  2019: 4499,
  2020: 3999,
  2021: 3999,
  2022: 3999,
  2023: 3999,
  2024: 3999,
  2025: 3999,
  2026: 3999,
};

const amountInput = document.getElementById("amount");
const yearInput = document.getElementById("year");
const yearValue = document.getElementById("yearValue");
const referencePriceElement = document.getElementById("referencePrice");
const convertButton = document.getElementById("convertButton");
const resultElement = document.getElementById("result");

const mxnFormat = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

function getReferencePrice() {
  const year = Number(yearInput.value);
  return threeDSPriceByYear[year];
}

function updateYearUI() {
  const year = yearInput.value;
  const referencePrice = getReferencePrice();
  yearValue.textContent = year;
  referencePriceElement.textContent = `${mxnFormat.format(referencePrice)} MXN`;
}

function convertToNekomamadas() {
  const amount = Number(amountInput.value);
  const referencePrice = getReferencePrice();
  const year = yearInput.value;

  if (!amountInput.value || Number.isNaN(amount) || amount <= 0) {
    resultElement.textContent = "Ingresa un monto válido mayor a 0.";
    return;
  }

  const nekomamadas = amount / referencePrice;
  resultElement.textContent = `${mxnFormat.format(amount)} en ${year} equivale a ${nekomamadas.toFixed(
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
