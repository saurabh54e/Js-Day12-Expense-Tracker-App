const form = document.getElementById("form");

const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const categorySelect = document.getElementById("category");

const typeInputs = document.querySelectorAll('input[name="type"]');

const balanceAmount = document.getElementById("balanceAmount");
const incomeAmount = document.getElementById("incomeAmount");
const expenseAmount = document.getElementById("expenseAmount");

const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");

const transactionList = document.getElementById("transaction-list");
const submitBtn = document.getElementById("submitBtn");

let editingId = null;
let transactions = [];

function renderTransactions() {
  transactionList.replaceChildren();
  transactions.forEach((transaction) => {
    const li = document.createElement("li");
    li.classList.add("transaction-item");

    const info = document.createElement("div");
    info.classList.add("transaction-info");

    const title = document.createElement("h4");
    title.classList.add("transaction-title");
    title.textContent = transaction.title;

    const category = document.createElement("p");
    category.classList.add("transaction-category");
    category.textContent = `${transaction.category} • ${transaction.date}`;

    const amount = document.createElement("span");
    if (transaction.type === "income") {
      amount.classList.add("transaction-amount", "income");
      amount.textContent = `+₹${transaction.amount}`;
    } else {
      amount.classList.add("transaction-amount", "expense");
      amount.textContent = `-₹${transaction.amount}`;
    }

    const action = document.createElement("div");
    action.classList.add("transaction-actions");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-delete");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      transactions = transactions.filter((item) => {
        return item.id !== transaction.id;
      });
      renderTransactions();
      updateSummary();
      saveTransactions();
    });

    const editBtn = document.createElement("button");
    editBtn.classList.add("btn", "btn-edit");
    editBtn.textContent = "Edit";

    editBtn.addEventListener("click", () => {
      submitBtn.textContent = "Update Transaction";
      editingId = transaction.id;
      titleInput.value = transaction.title;
      amountInput.value = transaction.amount;
      categorySelect.value = transaction.category;
      dateInput.value = transaction.date;
      typeInputs.forEach((input) => {
        if (input.value === transaction.type) {
          input.checked = true;
        } else {
          input.checked = false;
        }
      });
    });

    info.appendChild(title);
    info.appendChild(category);
    li.appendChild(info);
    li.appendChild(amount);
    action.appendChild(deleteBtn);
    action.appendChild(editBtn);
    li.appendChild(action);
    transactionList.appendChild(li);
  });
};

function updateSummary() {
  const income = transactions.filter((transaction) => {
    return transaction.type === "income";
  });
  const totalIncome = income.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);
  const expense = transactions.filter((transaction) => {
    return transaction.type === "expense";
  });
  const totalExpense = expense.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  const balance = totalIncome - totalExpense;
  balanceAmount.textContent = `₹${balance}`;
  incomeAmount.textContent = `₹${totalIncome}`;
  expenseAmount.textContent = `₹${totalExpense}`;
};


function saveTransactions() {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}

function loadTransactions() {
const savedTransactions = localStorage.getItem("transactions");
if (savedTransactions) {
transactions = JSON.parse(savedTransactions);
}
renderTransactions();
updateSummary();
}


form.addEventListener("submit", (e) => {
  e.preventDefault();
  titleInput.value = titleInput.value.trim();
  //   amountInput.value = amountInput.value;
  //   dateInput.value = dateInput.value;

  if (
    titleInput.value === "" ||
    amountInput.value === "" ||
    dateInput.value === ""
  ) {
    alert("Please fill in all fields");
    return;
  }

  const type = [...typeInputs].find((input) => input.checked).value;

const transaction = {
  id: editingId ?? Date.now(),
  title: titleInput.value,
  amount: Number(amountInput.value),
  category: categorySelect.value,
  type,
  date: dateInput.value,
};

  if (editingId === null) {
    transactions.push(transaction);
  } else {
    const index = transactions.findIndex(
      (transaction) => transaction.id === editingId,
    );

    transactions[index] = transaction;
    editingId = null;
    submitBtn.textContent = "Add Transaction";
  }

  renderTransactions();

  updateSummary();

  saveTransactions();

  form.reset();
  typeInputs[0].checked = true;
  submitBtn.textContent = "Add Transaction";
});



loadTransactions();