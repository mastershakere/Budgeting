const transactionForm = document.querySelector("#transaction-form");
const amountInput = document.getElementById("amount");
const textInput = document.getElementById("description");
const inputType = document.getElementById("type");
const transactionList = document.getElementById("transaction-list");
const categoryInput = document.getElementById("category");
const ctx = document.getElementById("expense-chart");
const clearAllBtn = document.getElementById("clear-all");
const dateInput = document.getElementById("date");
let expenseChart = null;




const transactions = getBudget();
transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const description = textInput.value;
    const amount = amountInput.value;
    const type = inputType.value;

    const transaction = {
        id: Date.now(),
        description,
        amount: Number(amount),
        type,
        date: dateInput.value,
        category: categoryInput.value
    };


    transactions.push(transaction);

    updateTransactionList(transactions);
    totalUpdate();
    updateChart();
    saveBudget();

    textInput.value = "";
    amountInput.value = "";
    inputType.value = "income";
})
clearAllBtn.addEventListener("click", function () {
        const ok = confirm("Clear all transactions?");
        if (!ok) return
    
        transactions.length = 0;
        localStorage.removeItem("budget");
        updateTransactionList(transactions);
        totalUpdate();
        updateChart();
        saveBudget();
});

function updateTransactionList(data) {
    transactionList.innerHTML = "";

    if (data.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No transactions yet.";
    li.classList.add("empty-state");
    transactionList.appendChild(li);
    return;
  }

    data.forEach(function (item) {
        const li = document.createElement("li");

        const textSpan = document.createElement("span");
        textSpan.textContent = `${item.description} - $${item.amount.toFixed(2)} (${item.type}) | ${item.category} | ${item.date}`;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "8px";

        deleteBtn.addEventListener("click", function () {
        deleteTransaction(item.id);
        });

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);




    
    transactionList.appendChild(li);
        
    });
}

function totalUpdate(){
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach (function (transaction) {
        if (transaction.type === "income") {
            incomeTotal += transaction.amount;
        }   else if (transaction.type === "expense") {
            expenseTotal += transaction.amount;
        }
    });

    const balance = incomeTotal - expenseTotal;

    document.getElementById("income-total").textContent = `$
    ${incomeTotal.toFixed(2)}`;
    document.getElementById("expense-total").textContent =`$
    ${expenseTotal.toFixed(2)}`;
    document.getElementById("balance").textContent = `$
    ${balance.toFixed(2)}`;
}

function deleteTransaction(id) {
    const index = transactions.findIndex (t => t.id === id);
    if (index === -1) return;

    transactions.splice(index, 1);

    updateTransactionList(transactions);
    totalUpdate();
    updateChart();
    saveBudget();
}

function saveBudget(){
    const budgetJson = JSON.stringify(transactions);
    localStorage.setItem("budget", budgetJson);
}

function getBudget(){
    const budget = localStorage.getItem("budget") || "[]";
    return JSON.parse(budget);
}

function getExpenseByCategory() {
    const totals = {};

    transactions.forEach(function (transaction) {
        if (transaction.type === "expense") {
            if (!totals[transaction.category]) {
                totals[transaction.category] = 0;
            }
            totals[transaction.category] += transaction.amount;
        }
    });

    return totals;
}

function updateChart() {
    const categoryTotals = getExpenseByCategory();
    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#ff6384",
                    "#36a2eb",
                    "#ffce56",
                    "#4bc0c0",
                    "#9955ff",
                    "#ff9f40"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

updateTransactionList(transactions);
totalUpdate();
updateChart();