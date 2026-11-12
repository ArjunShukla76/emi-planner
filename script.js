// Format a number as Indian rupees, e.g. 1234567 -> ₹12,34,567
function formatINR(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

// Core logic: build the month-by-month loan schedule
function buildSchedule(principal, annualRate, years, extra) {
  const r = annualRate / 12 / 100;   // monthly interest rate
  const n = years * 12;              // total number of months

  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  let emi;
  if (r === 0) {
    emi = principal / n;
  } else {
    const growth = Math.pow(1 + r, n);
    emi = (principal * r * growth) / (growth - 1);
  }

  let balance = principal;
  let totalInterest = 0;
  const rows = [];
  let month = 0;

  // Each month: interest is charged on the remaining balance,
  // the rest of the EMI (plus any extra) reduces the balance.
  while (balance > 0.5 && month < n) {
    month++;
    const interest = balance * r;
    let principalPaid = emi - interest + extra;
    if (principalPaid > balance) {
      principalPaid = balance;       // last payment can't exceed what's owed
    }
    balance -= principalPaid;
    totalInterest += interest;
    rows.push({ month, interest, principalPaid, balance });
  }

  return { emi, rows, totalInterest };
}

function calculate() {
  const amount = Number(document.getElementById("amount").value);
  const rate = Number(document.getElementById("rate").value);
  const years = Number(document.getElementById("tenure").value);
  const extra = Number(document.getElementById("extra").value) || 0;
  const results = document.getElementById("results");

  // Basic input checks
  if (amount <= 0 || rate < 0 || years <= 0 || extra < 0) {
    results.innerHTML =
      '<div class="card error">Please enter valid positive values.</div>';
    return;
  }

  const base = buildSchedule(amount, rate, years, 0);
  const withExtra = buildSchedule(amount, rate, years, extra);

  let html = '<div class="card"><div class="stats">';
  html += `<div class="stat"><span>Monthly EMI</span><strong>${formatINR(base.emi)}</strong></div>`;
  html += `<div class="stat"><span>Total interest</span><strong>${formatINR(base.totalInterest)}</strong></div>`;
  html += `<div class="stat"><span>Total payment</span><strong>${formatINR(amount + base.totalInterest)}</strong></div>`;
  html += `<div class="stat"><span>Months to repay</span><strong>${base.rows.length}</strong></div>`;
  html += "</div>";

  // Show the prepayment benefit only if an extra amount was entered
  if (extra > 0) {
    const interestSaved = base.totalInterest - withExtra.totalInterest;
    const monthsSaved = base.rows.length - withExtra.rows.length;
    html += `<div class="savings">With ₹${extra.toLocaleString("en-IN")} extra per month, you save
      <strong>${formatINR(interestSaved)}</strong> in interest and finish
      <strong>${monthsSaved}</strong> months earlier.</div>`;
  }
  html += "</div>";

  // Amortization table (uses the prepayment schedule if extra > 0)
  const shown = extra > 0 ? withExtra : base;
  html += '<div class="card"><h2>Amortization schedule</h2><div class="table-wrap"><table>';
  html += "<tr><th>Month</th><th>Interest</th><th>Principal</th><th>Balance</th></tr>";
  shown.rows.forEach(function (row) {
    html += `<tr><td>${row.month}</td><td>${formatINR(row.interest)}</td><td>${formatINR(row.principalPaid)}</td><td>${formatINR(row.balance)}</td></tr>`;
  });
  html += "</table></div></div>";

  results.innerHTML = html;
}

document.getElementById("calculate").addEventListener("click", calculate);
calculate();
