const pricesUrl = "https://interview.switcheo.com/prices.json";
const tokenImageUrl =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

let tokenPrices = {};

async function fetchPrices() {
  try {
    const response = await fetch(pricesUrl);
    const rawData = await response.json();

    // Transform the raw data into an object with 'currency' as the key and 'price' as the value
    const prices = rawData.reduce((acc, item) => {
      acc[item.currency] = item.price;
      return acc;
    }, {});

    console.log("Transformed token prices:", prices);
    return prices;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    return {};
  }
}

function populateDropdown(dropdownId, tokens) {
  const dropdown = document.getElementById(dropdownId);
  const optionsContainer = dropdown.querySelector(".dropdown-options");
  optionsContainer.innerHTML = ""; // Clear existing options

  for (const [key, value] of Object.entries(tokens)) {
    const option = document.createElement("div");
    option.className = "dropdown-option";
    option.dataset.value = key;
    option.innerHTML = `
      <img src="${tokenImageUrl}${key}.svg" alt="${key}" />
      <span>${key.toUpperCase()} - $${value}</span>
    `;

    option.addEventListener("click", () => {
      const selected = dropdown.querySelector(".dropdown-selected");
      selected.innerHTML = option.innerHTML;
      selected.dataset.value = key;

      optionsContainer.classList.remove("show");
    });

    optionsContainer.appendChild(option);
  }

  // Toggle options on click
  const selected = dropdown.querySelector(".dropdown-selected");
  selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("show");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      optionsContainer.classList.remove("show");
    }
  });
}

async function initialize() {
  tokenPrices = await fetchPrices();
  populateDropdown("from-token-dropdown", tokenPrices);
  populateDropdown("to-token-dropdown", tokenPrices);

  document.getElementById("confirm-swap").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission
    updateOutputAmount(); // Only call this when the button is clicked
  });
}

function calculateConversionRate(fromToken, toToken, amount) {
  if (!tokenPrices[fromToken] || !tokenPrices[toToken]) {
    return 0;
  }
  // Conversion rate = amount * (fromTokenPrice / toTokenPrice)
  const fromPrice = tokenPrices[fromToken];
  const toPrice = tokenPrices[toToken];
  const rate = (amount * fromPrice) / toPrice;
  return rate;
}

function updateOutputAmount() {
  const fromToken = document.getElementById("from-token-dropdown").querySelector(".dropdown-selected").dataset.value;
  const toToken = document.getElementById("to-token-dropdown").querySelector(".dropdown-selected").dataset.value;
  const inputAmount = parseFloat(document.getElementById("input-amount").value) || 0;

  const outputAmount = calculateConversionRate(fromToken, toToken, inputAmount);
  document.getElementById("output-amount").value = outputAmount.toFixed(6);
}

// Fetch prices and initialize on page load
document.addEventListener("DOMContentLoaded", initialize);
