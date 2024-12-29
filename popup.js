const apiURL = "https://api.exchangerate-api.com/v4/latest/KRW";

// Format input value with commas
const amountInput = document.getElementById("amount");

amountInput.addEventListener("input", (event) => {
  const value = event.target.value.replace(/,/g, "");
  if (!isNaN(value) && value.trim() !== "") {
    event.target.value = parseFloat(value).toLocaleString();
  } else {
    event.target.value = "";
  }
});

document.getElementById("convert").addEventListener("click", async () => {
  const amount = parseFloat(amountInput.value.replace(/,/g, ""));
  const currency = document.getElementById("currency").value;

  if (!amount || amount <= 0) {
    document.getElementById("amount-currency-box").innerText = "Invalid input";
    document.getElementById("converted-amount-box").innerText = "";
    return;
  }

  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    const rate = currency === "KRW" ? data.rates["VND"] : 1 / data.rates["VND"];
    const convertedAmount = (amount * rate).toFixed(2);

    // Update the boxes with values
    document.getElementById("amount-currency-box").innerText = `${amount.toLocaleString()} ${currency}`;
    document.getElementById("converted-amount-box").innerText = `${parseFloat(convertedAmount).toLocaleString()} ${currency === "KRW" ? "VND" : "KRW"}`;

    // Display the last updated date and time with timezone
    const timestamp = new Date(data.time_last_updated * 1000);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let timezoneAbbreviation = "";
    if (userTimeZone.includes("Seoul")) {
      timezoneAbbreviation = "KST";
    } else if (userTimeZone.includes("Ho_Chi_Minh")) {
      timezoneAbbreviation = "VNT";
    }

    document.getElementById("rate-timestamp").innerText = `Exchange rate as of ${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(timestamp.getDate()).padStart(2, '0')} ${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')} ${timezoneAbbreviation}`;
  } catch (error) {
    document.getElementById("amount-currency-box").innerText = "Error fetching rates";
    document.getElementById("converted-amount-box").innerText = "";
    document.getElementById("rate-timestamp").innerText = "";
  }
});
