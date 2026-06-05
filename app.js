const transactionForm = document.querySelector("#transaction-form");
const amountInput = document.getElementById("amount");
const textInput = document.getElementById("description");
const inputType = document.getElementById("type");
const transactionList = document.getElementById("transaction-list");

const transactions = [];
transactionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const description = textInput.value;
    const amount = amountInput.value;
    const type = inputType.value;

    const transaction = {
        description,
        amount: Number(amount),
        type
    }


    transactions.push(transaction);

    updateTransactionList(transactions);
    totalUpdate();

    textInput.value = "";
    amountInput.value = "";
    inputType.value = "income";
})


function updateTransactionList(data) {
    transactionList.innerHTML = "";

    data.forEach(function (item) {
        const li = document.createElement("li");

        const textSpan = document.createElement("span");
        textSpan.textContent = `${item.description} - $${item.amount.toFixed(2)} (${item.type})`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "8px";

        deleteBtn.addEventListener("click", function () {
        deleteTransaction(item.id);
        });

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);




    li.textContent = `${item.description} - $${item.amount}
    (${item.type})`;
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

    transactions.splice(index, -1);

    updateTransactionList(transactions);
    totalUpdate();
}