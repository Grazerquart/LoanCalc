getTable();
function getTable() {
  let amount = document.getElementById("loan-amount").value;
  let term = document.getElementById("loan-months").value;
  let rate = document.getElementById("loan-interest").value;
  amount = Number.parseFloat(amount);
  term = Number.parseInt(term);
  rate = Number.parseFloat(rate);
  if (
    Number.parseFloat(amount) &&
    Number.isInteger(term) &&
    Number.parseFloat(rate)
  ) {
    // Float, Int, Float
    let months = calcLoan(amount, term, rate);
    buildCard(months);
    buildTable(months);
  } else {
    alert("Please input valid number");
  }
}
function calcLoan(amount, term, rate) {
  let months = [];
  let rOverM = rate / 1200;
  let onePlusROverM = 1 + rOverM;
  let amountTimesrOverM = amount * rOverM;
  let onePlusROverMExpNegTerm = onePlusROverM ** -term;
  let monPayment = amountTimesrOverM / (1 - onePlusROverMExpNegTerm);
  let totalOwed = monPayment * term;
  // monthZero Object
  let monthZero = {};
  monthZero["month"] = 0;
  monthZero["payment"] = monPayment;
  monthZero["remBalance"] = amount;
  monthZero["priPayment"] = 0;
  monthZero["intPayment"] = 0;
  monthZero["tInterest"] = 0;
  monthZero["tOwed"] = totalOwed;
  months.push(monthZero);
  for (let i = 1; i <= term; i++) {
    let curMonth = {};
    curMonth["month"] = i;
    curMonth["payment"] = monPayment;
    curMonth["intPayment"] = months[i - 1].remBalance * rOverM;
    curMonth["priPayment"] = monPayment - curMonth.intPayment;
    curMonth["remBalance"] = months[i - 1].remBalance - curMonth.priPayment;
    curMonth["tInterest"] = months[i - 1].tInterest + curMonth.intPayment;
    curMonth["tOwed"] = months[i - 1].tOwed - monPayment;
    months.push(curMonth);
  }
  return months;
}
function buildCard(data) {
  // Grab Data
  let monPayment = data[0].payment.toFixed(2);
  let totalCost = data[0].tOwed.toFixed(2);
  let totalInterest = data[data.length - 1].tInterest.toFixed(2);
  let totalPrincipal = data[0].remBalance.toFixed(2);
  // Grab Elements
  let target = document.getElementById("card-template-target");
  target.innerHTML = "";
  let template = document.importNode(
    document.getElementById("payment-card-template").content,
    true
  );
  template.querySelector("[data-monthly]").textContent = monPayment;
  template.querySelector("[data-total-principal]").textContent =
    "$" + totalPrincipal;
  template.querySelector("[data-total-interest]").textContent =
    "$" + totalInterest;
  template.querySelector("[data-total-cost]").textContent = "$" + totalCost;
  target.appendChild(template);
}
function buildTable(months) {
  // Grab Elements
  let target = document.getElementById("table-row-target");
  target.innerHTML = "";
  months.forEach((index) => {
    let template = document.importNode(
      document.getElementById("table-row-template").content,
      true
    );
    let month = template.querySelector("[data-month]");
    let payment = template.querySelector("[data-payment]");
    let principal = template.querySelector("[data-principal]");
    let interest = template.querySelector("[data-interest]");
    let totalInterest = template.querySelector("[data-total-interest]");
    let balance = template.querySelector("[data-balance]");
    if (index.month == 0) {
    } else {
      month.textContent = index.month;
      payment.textContent = "$" + index.payment.toFixed(2);
      principal.textContent = "$" + index.priPayment.toFixed(2);
      interest.textContent = "$" + index.intPayment.toFixed(2);
      totalInterest.textContent = "$" + index.tInterest.toFixed(2);
      balance.textContent = "$" + Math.abs(index.remBalance.toFixed(2));
      target.appendChild(template);
    }
  });
}
