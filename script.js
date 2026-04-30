const switchPriceByYear = {
  2017: 9999,
  2018: 9899,
  2019: 9499,
  2020: 9399,
  2021: 9199,
  2022: 8999,
  2023: 8699,
  2024: 8599,
  2025: 8499,
  2026: 8399,
};

const amountInput = document.getElementById("amount");
const yearInput = document.getElementById("year");
const yearValue = document.getElementById("yearValue");
const switchPriceElement = document.getElementById("switchPrice");
const convertButton = document.getElementById("convertButton");
const resultElement = document.getElementById("result");

const mxnFormat = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

function getCurrentSwitchPrice() {
  const year = Number(yearInput.value);
  return switchPriceByYear[year];
}

function updateYearUI() {
  const year = yearInput.value;
  const switchPrice = getCurrentSwitchPrice();
  yearValue.textContent = year;
  switchPriceElement.textContent = `${mxnFormat.format(switchPrice)} MXN`;
}

function convertToNekomamadas() {
  const amount = Number(amountInput.value);
  const switchPrice = getCurrentSwitchPrice();
  const year = yearInput.value;

  if (!amountInput.value || Number.isNaN(amount) || amount <= 0) {
    resultElement.textContent = "Ingresa un monto valido mayor a 0.";
    return;
  }

  const nekomamadas = amount / switchPrice;
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
