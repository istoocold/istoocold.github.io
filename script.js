// Hardcoded login
const USERNAME = "user";
const PASSWORD = "password";

let trips = [];
let currentTrip = null;

// Data for calculator
let participants = [];
let expenses = [];

// Login function
function checkLogin() {
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;
  const error = document.getElementById("loginError");

  if (user === USERNAME && pass === PASSWORD) {
    switchPage("loginPage", "tripPage");
  } else {
    error.textContent = "❌ Invalid username or password!";
  }
}

// Switch between pages
function switchPage(hideId, showId) {
  document.getElementById(hideId).classList.remove("active");
  document.getElementById(hideId).classList.add("hidden");

  document.getElementById(showId).classList.remove("hidden");
  document.getElementById(showId).classList.add("active");
}

// Handle trips
document.getElementById("addTripBtn").addEventListener("click", () => {
  document.getElementById("popup").classList.remove("hidden");
});

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

function saveTrip() {
  const name = document.getElementById("tripNameInput").value.trim();
  if (name) {
    trips.push(name);
    renderTrips();
    document.getElementById("tripNameInput").value = "";
    closePopup();
  } else {
    alert("Trip name cannot be empty!");
  }
}

function renderTrips() {
  const tripList = document.getElementById("tripList");
  tripList.innerHTML = "";
  trips.forEach((trip) => {
    const tripItem = document.createElement("div");
    tripItem.classList.add("trip-item");
    tripItem.textContent = trip;
    tripItem.onclick = () => openCalculator(trip);
    tripList.appendChild(tripItem);
  });
}

// Open calculator page
function openCalculator(tripName) {
  currentTrip = tripName;
  participants = [];
  expenses = [];

  document.getElementById("calcTitle").textContent = `Trip Calculator: ${tripName}`;
  document.getElementById("participantsList").innerHTML = "";
  document.getElementById("expensesList").innerHTML = "";
  document.getElementById("payerSelect").innerHTML = "";
  document.getElementById("result").innerHTML = "";

  switchPage("tripPage", "calcPage");
}

// Back button
function backToTrips() {
  switchPage("calcPage", "tripPage");
}

/* --------------------
   Calculator Functions
---------------------*/

// Add participant
function addParticipant() {
  const name = document.getElementById("participantInput").value.trim();
  if (name && !participants.includes(name)) {
    participants.push(name);

    // Update list
    const li = document.createElement("li");
    li.textContent = name;
    document.getElementById("participantsList").appendChild(li);

    // Update payer dropdown
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    document.getElementById("payerSelect").appendChild(option);

    document.getElementById("participantInput").value = "";
  }
}

// Add expense
function addExpense() {
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const payer = document.getElementById("payerSelect").value;

  if (amount > 0 && payer) {
    expenses.push({ payer, amount });

    // Update list
    const li = document.createElement("li");
    li.textContent = `${payer} paid ₹${amount}`;
    document.getElementById("expensesList").appendChild(li);

    document.getElementById("expenseAmount").value = "";

    calculateSplit();
  }
}

// Calculate split
function calculateSplit() {
  if (participants.length === 0 || expenses.length === 0) return;

  let total = expenses.reduce((sum, e) => sum + e.amount, 0);
  let perPerson = total / participants.length;

  // Balance per person
  let balances = {};
  participants.forEach(p => balances[p] = 0);
  expenses.forEach(e => balances[e.payer] += e.amount);

  let resultHTML = `<p>Total: ₹${total} | Each pays: ₹${perPerson.toFixed(2)}</p>`;
  resultHTML += "<ul>";
  participants.forEach(p => {
    let balance = balances[p] - perPerson;
    if (balance > 0) {
      resultHTML += `<li>✅ ${p} should receive ₹${balance.toFixed(2)}</li>`;
    } else if (balance < 0) {
      resultHTML += `<li>💸 ${p} should pay ₹${Math.abs(balance).toFixed(2)}</li>`;
    } else {
      resultHTML += `<li>⚖ ${p} is settled</li>`;
    }
  });
  resultHTML += "</ul>";

  document.getElementById("result").innerHTML = resultHTML;
}
