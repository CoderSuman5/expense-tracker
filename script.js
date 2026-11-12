// Load saved data from Local Storage
let expenses = JSON.parse(localStorage.getItem("expenses")) || []
let savedIncome = Number(localStorage.getItem("income")) || 0
let editingExpenseId = null

// DOM elements
const expenseName = document.getElementById("expanseName")
const expenseAmount = document.getElementById("expanseAmount")
const addButton = document.getElementById("addBtn")
const expenseList = document.getElementById("expenseList")
const total = document.getElementById("total")
const message = document.getElementById("message")
const expenseDate = document.getElementById("expenseDate")
const expenseCategory = document.getElementById("expenseCategory")
const searchInput = document.getElementById("searchInput")
const filterCategory = document.getElementById("filterCategory")
const filterDate = document.getElementById("filterDate")
const incomeAmount = document.getElementById("incomeAmount")
const saveIncomeBtn = document.getElementById("saveIncomeBtn")
const income = document.getElementById("income")
const balance = document.getElementById("balance")
const categorySummary = document.getElementById("categorySummary")
const clearFiltersBtn = document.getElementById("clearFiltersBtn")
const expenseCount = document.getElementById("expenseCount")
const insightCount = document.getElementById("insightCount")
const averageExpense = document.getElementById("averageExpense")
const categoryChart = document.getElementById("categoryChart")
const chartTotal = document.getElementById("chartTotal")
const topCategory = document.getElementById("topCategory")
const formHeading = document.getElementById("formHeading")

const categoryNames = {
    food: "Food & Dining",
    travel: "Travel",
    shopping: "Shopping",
    bills: "Bills",
    entertainment: "Entertainment",
    health: "Health",
    other: "Other"
}

const categoryColors = {
    food: "#25ae83",
    travel: "#2cafd0",
    shopping: "#8b5cf6",
    bills: "#e7a83e",
    entertainment: "#df70a4",
    health: "#5c9bd5",
    other: "#94a3b8"
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
})

function formatCurrency(amount) {
    return currencyFormatter.format(Number(amount) || 0)
}

function normalizeCategory(category) {
    const normalized = String(category || "other").trim().toLowerCase()

    // Keep older expenses saved with the previous "shoping" spelling compatible.
    if (normalized === "shoping") {
        return "shopping"
    }

    return normalized
}

function getCategoryName(category) {
    const key = normalizeCategory(category)
    return categoryNames[key] || (key.charAt(0).toUpperCase() + key.slice(1))
}

// Event listeners
addButton.addEventListener("click", addExpense)
searchInput.addEventListener("input", filterExpenses)
filterCategory.addEventListener("change", filterExpenses)
filterDate.addEventListener("change", filterExpenses)
saveIncomeBtn.addEventListener("click", saveIncome)
clearFiltersBtn.addEventListener("click", clearFilters)

function addExpense() {
    const name = expenseName.value.trim()
    const amount = Number(expenseAmount.value)
    const date = expenseDate.value
    const category = normalizeCategory(expenseCategory.value)

    if (name === "") {
        showMessage("Please enter an expense name.")
        expenseName.focus()
        return
    }

    if (expenseAmount.value === "" || !Number.isFinite(amount) || amount <= 0) {
        showMessage("Please enter an amount greater than zero.")
        expenseAmount.focus()
        return
    }

    if (date === "") {
        showMessage("Please select an expense date.")
        expenseDate.focus()
        return
    }

    if (expenseCategory.value === "") {
        showMessage("Please select a category.")
        expenseCategory.focus()
        return
    }

    if (editingExpenseId !== null) {
        const expense = expenses.find(function(item) {
            return String(item.id) === String(editingExpenseId)
        })

        if (!expense) {
            showMessage("This expense could not be found. Please select it again.")
            resetExpenseForm()
            return
        }

        expense.name = name
        expense.amount = amount
        expense.date = date
        expense.category = category
    } else {
        expenses.push({
            id: Date.now(),
            name: name,
            amount: amount,
            date: date,
            category: category
        })
    }

    saveExpenses()
    resetExpenseForm()
    filterExpenses()
    updateDashboard()
}

function showMessage(text, isError = true) {
    message.textContent = text
    message.style.color = isError ? "#c65d5d" : "#168967"
}

function resetExpenseForm() {
    expenseName.value = ""
    expenseAmount.value = ""
    expenseDate.value = ""
    expenseCategory.value = ""
    editingExpenseId = null
    addButton.textContent = "＋ Add expense"
    formHeading.textContent = "Add an expense"
}

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses))
}

function filterExpenses() {
    const searchText = searchInput.value.toLowerCase().trim()
    const selectedCategory = filterCategory.value
    const selectedMonth = filterDate.value

    const filteredExpenses = expenses.filter(function(expense) {
        const matchesSearch = expense.name.toLowerCase().includes(searchText)
        const matchesCategory =
            selectedCategory === "all" ||
            normalizeCategory(expense.category) === selectedCategory
        const matchesMonth =
            selectedMonth === "" ||
            String(expense.date || "").startsWith(selectedMonth)

        return matchesSearch && matchesCategory && matchesMonth
    })

    displayExpenses(filteredExpenses)
}

function clearFilters() {
    searchInput.value = ""
    filterCategory.value = "all"
    filterDate.value = ""
    filterExpenses()
}

function displayExpenses(expensesToDisplay = expenses) {
    expenseList.innerHTML = ""
    expenseCount.textContent = `${expensesToDisplay.length} ${expensesToDisplay.length === 1 ? "entry" : "entries"}`

    if (expensesToDisplay.length === 0) {
        const emptyMessage = document.createElement("li")
        emptyMessage.classList.add("empty-message")
        emptyMessage.textContent = expenses.length === 0
            ? "No expenses yet. Add your first expense above."
            : "No expenses match these filters. Try clearing your filters."
        expenseList.appendChild(emptyMessage)
        return
    }

    const sortedExpenses = [...expensesToDisplay].sort(function(a, b) {
        return String(b.date).localeCompare(String(a.date)) || Number(b.id) - Number(a.id)
    })

    sortedExpenses.forEach(function(expense) {
        const li = document.createElement("li")
        li.classList.add("expense-item")

        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        const nameElement = document.createElement("span")
        nameElement.classList.add("expense-name")
        nameElement.textContent = expense.name

        const amountElement = document.createElement("span")
        amountElement.classList.add("expense-amount")
        amountElement.textContent = formatCurrency(expense.amount)

        const dateElement = document.createElement("span")
        dateElement.classList.add("expense-date")
        dateElement.textContent = formatDate(expense.date)

        const categoryElement = document.createElement("span")
        categoryElement.classList.add("expense-category")
        categoryElement.dataset.category = normalizeCategory(expense.category)
        categoryElement.textContent = getCategoryName(expense.category)

        expenseInfo.appendChild(nameElement)
        expenseInfo.appendChild(amountElement)
        expenseInfo.appendChild(dateElement)
        expenseInfo.appendChild(categoryElement)

        const actions = document.createElement("div")
        actions.classList.add("expense-actions")

        const editButton = document.createElement("button")
        editButton.type = "button"
        editButton.textContent = "✎"
        editButton.title = "Edit expense"
        editButton.setAttribute("aria-label", `Edit ${expense.name}`)
        editButton.classList.add("edit-btn")
        editButton.addEventListener("click", function() {
            editExpense(expense.id)
        })

        const deleteButton = document.createElement("button")
        deleteButton.type = "button"
        deleteButton.textContent = "⌫"
        deleteButton.title = "Delete expense"
        deleteButton.setAttribute("aria-label", `Delete ${expense.name}`)
        deleteButton.classList.add("delete-btn")
        deleteButton.addEventListener("click", function() {
            const confirmDelete = confirm(`Are you sure you want to delete "${expense.name}"?`)
            if (confirmDelete) {
                deleteExpense(expense.id)
            }
        })

        actions.appendChild(editButton)
        actions.appendChild(deleteButton)
        li.appendChild(expenseInfo)
        li.appendChild(actions)
        expenseList.appendChild(li)
    })
}

function formatDate(dateValue) {
    if (!dateValue) return "Date not set"

    const parts = String(dateValue).split("-")
    if (parts.length !== 3) return dateValue

    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    })
}

function editExpense(id) {
    const expense = expenses.find(function(item) {
        return String(item.id) === String(id)
    })

    if (!expense) {
        showMessage("Expense not found.")
        return
    }

    editingExpenseId = expense.id
    expenseName.value = expense.name
    expenseAmount.value = expense.amount
    expenseDate.value = expense.date
    expenseCategory.value = normalizeCategory(expense.category)

    addButton.textContent = "Update expense"
    formHeading.textContent = "Edit your expense"
    message.textContent = ""

    document.querySelector(".add-panel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    })
    expenseName.focus({ preventScroll: true })
}

function deleteExpense(id) {
    expenses = expenses.filter(function(expense) {
        return String(expense.id) !== String(id)
    })

    saveExpenses()
    filterExpenses()
    updateDashboard()
}

function saveIncome() {
    const amountText = incomeAmount.value
    const amount = Number(amountText)

    if (amountText === "" || !Number.isFinite(amount) || amount < 0) {
        showMessage("Please enter a valid income amount.")
        incomeAmount.focus()
        return
    }

    savedIncome = amount
    localStorage.setItem("income", String(savedIncome))
    incomeAmount.value = ""
    showMessage("Income updated successfully.", false)
    calculateBalance()
}

function calculateTotal() {
    const totalAmount = expenses.reduce(function(sum, expense) {
        return sum + Number(expense.amount || 0)
    }, 0)

    total.textContent = formatCurrency(totalAmount)
    return totalAmount
}

function calculateBalance() {
    const totalAmount = expenses.reduce(function(sum, expense) {
        return sum + Number(expense.amount || 0)
    }, 0)

    income.textContent = formatCurrency(savedIncome)
    balance.textContent = formatCurrency(savedIncome - totalAmount)
}

function calculateCategorySummary() {
    const categoryTotals = {}

    expenses.forEach(function(expense) {
        const category = normalizeCategory(expense.category)
        categoryTotals[category] = (categoryTotals[category] || 0) + Number(expense.amount || 0)
    })

    categorySummary.innerHTML = ""

    const entries = Object.entries(categoryTotals).sort(function(a, b) {
        return b[1] - a[1]
    })

    const grandTotal = entries.reduce(function(sum, entry) {
        return sum + entry[1]
    }, 0)

    chartTotal.textContent = formatCurrency(grandTotal)

    if (entries.length === 0 || grandTotal === 0) {
        categorySummary.innerHTML = '<p class="summary-empty">Add expenses to see your category breakdown.</p>'
        categoryChart.style.background = "conic-gradient(#e8efeb 0deg 360deg)"
        topCategory.textContent = "No expenses yet"
        return
    }

    let currentAngle = 0
    const segments = []

    entries.forEach(function(entry) {
        const category = entry[0]
        const amount = entry[1]
        const degrees = (amount / grandTotal) * 360
        const nextAngle = currentAngle + degrees
        const color = categoryColors[category] || categoryColors.other

        segments.push(`${color} ${currentAngle}deg ${nextAngle}deg`)
        currentAngle = nextAngle

        const legendItem = document.createElement("div")
        legendItem.classList.add("legend-item")

        const dot = document.createElement("span")
        dot.classList.add("legend-dot")
        dot.style.backgroundColor = color

        const name = document.createElement("span")
        name.classList.add("legend-name")
        name.textContent = getCategoryName(category)

        const value = document.createElement("strong")
        value.classList.add("legend-value")
        value.textContent = formatCurrency(amount)

        legendItem.appendChild(dot)
        legendItem.appendChild(name)
        legendItem.appendChild(value)
        categorySummary.appendChild(legendItem)
    })

    categoryChart.style.background = `conic-gradient(${segments.join(", ")})`
    topCategory.textContent = `${getCategoryName(entries[0][0])} · ${formatCurrency(entries[0][1])}`
}

function updateDashboard() {
    const totalAmount = calculateTotal()
    calculateBalance()
    calculateCategorySummary()

    insightCount.textContent = expenses.length
    const average = expenses.length ? totalAmount / expenses.length : 0
    averageExpense.textContent = formatCurrency(average)
}

// Initial page render
filterExpenses()
updateDashboard()
