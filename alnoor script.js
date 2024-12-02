const transactionTable = document.getElementById('transactionTable');
const totalBalanceDisplay = document.getElementById('totalBalance');

let transactions = JSON.parse(localStorage.getItem('transactions')) || []; // Retrieve from localStorage or use empty array
let editIndex = -1;

document.getElementById('addTransactionBtn').onclick = addOrUpdateTransaction;

// Function to add or update a transaction
function addOrUpdateTransaction() {
    const date = document.getElementById('transactionDate').value;
    const credit = parseFloat(document.getElementById('creditAmount').value) || 0;
    const debit = parseFloat(document.getElementById('debitAmount').value) || 0;
    const description = document.getElementById('description').value;

    // Validation for required fields
    if (date === '') {
        alert('Please select a date.');
        return;
    }
    if (credit < 0 || debit < 0) {
        alert('Credit and Debit amounts must be non-negative.');
        return;
    }
    if (description.trim() === '') {
        alert('Please provide a description.');
        return;
    }

    const balance = credit - debit;
    
    if (editIndex === -1) {
        // Add new transaction
        const transaction = { date, credit, debit, description, balance };
        transactions.push(transaction);
    } else {
        // Edit existing transaction
        transactions[editIndex] = { date, credit, debit, description, balance };
        editIndex = -1;  // Reset edit index after update
    }

    updateLocalStorage();  // Save to localStorage
    renderTransactions();  // Render the updated transactions
    clearInputs();  // Clear input fields
}

// Render all transactions to the table
function renderTransactions() {
    if (transactions.length === 0) {
        transactionTable.innerHTML = `
            <tr>
                <th>Date</th>
                <th>Credit</th>
                <th>Debit</th>
                <th>Description</th>
                <th>Actions</th>
            </tr>
            <tr>
                <td colspan="5" style="text-align:center;">No transactions found.</td>
            </tr>
        `;
        totalBalanceDisplay.textContent = "0.00";  // Display zero balance when no transactions exist
        return;
    }

    const rows = transactions.map((t, index) => `
        <tr>
            <td>${t.date}</td>
            <td>${t.credit}</td>
            <td>${t.debit}</td>
            <td>${t.description}</td>
            <td>
                <button onclick="editTransaction(${index})">Edit</button>
                <button onclick="deleteTransaction(${index})">Delete</button>
            </td>
        </tr>
    `).join('');

    transactionTable.innerHTML = `
        <tr>
            <th>Date</th>
            <th>Credit</th>
            <th>Debit</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
        ${rows}
    `;

    updateTotalBalance();  // Update total balance display
}

// Update the total balance displayed at the bottom
function updateTotalBalance() {
    const totalBalance = transactions.reduce((acc, t) => acc + t.credit - t.debit, 0);
    totalBalanceDisplay.textContent = totalBalance.toFixed(2);  // Show two decimals for currency
}

// Clear input fields after adding or editing a transaction
function clearInputs() {
    document.getElementById('transactionDate').value = '';
    document.getElementById('creditAmount').value = '';
    document.getElementById('debitAmount').value = '';
    document.getElementById('description').value = '';
    editIndex = -1;  // Reset edit mode
}

// Delete a transaction by index
function deleteTransaction(index) {
    transactions.splice(index, 1);  // Remove transaction from the array
    updateLocalStorage();  // Save updated array to localStorage
    renderTransactions();  // Re-render the table
}

// Set input fields to edit a transaction
function editTransaction(index) {
    const transaction = transactions[index];
    document.getElementById('transactionDate').value = transaction.date;
    document.getElementById('creditAmount').value = transaction.credit;
    document.getElementById('debitAmount').value = transaction.debit;
    document.getElementById('description').value = transaction.description;
    editIndex = index;  // Set the index for editing
}

// Save the transactions to localStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initial render when the page loads
renderTransactions();
