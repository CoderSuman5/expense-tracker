let expenses = JSON.parse(localStorage.getItem("expenses")) || []
let editingExpenseId = null

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

addButton.addEventListener("click", addExpense)
searchInput.addEventListener("input", filterExpenses)
filterCategory.addEventListener("change", filterExpenses)

function addExpense(){
    const name = expenseName.value.trim()
    const amount = Number(expenseAmount.value)
    const date = expenseDate.value
    const category = expenseCategory.value

    if (name === "") {
        message.textContent = "Please enter expense name"
        message.style.color = "red"
        return
    }

    if (expenseAmount.value === "") {
        message.textContent = "Please enter amount"
        message.style.color = "red"
        return
    }

    if (amount <= 0) {
        message.textContent = "Please enter a valid amount"
        message.style.color = "red"
        return
    }

    if (date === "") {
        message.textContent = "Please enter a valid date"
        message.style.color = "red"
        return
    }

    if (category === "") {
        message.textContent = "Please enter a valid category"
        message.style.color = "red"
        return
    }

    if (editingExpenseId !== null) {
         
        const expense = expenses.find(function(expense){
            return expense.id === editingExpenseId
        })

        expense.name = name
        expense.amount = amount
        expense.date = date
        expense.category = category
        
    } else {

     const expense = {
        id: Date.now(),
        name: name,
        amount: amount, 
        date: date,
        category: category
    }

    expenses.push(expense)

    }

    // saving items in local stroge for better memory function
    localStorage.setItem("expenses", JSON.stringify(expenses))

    expenseName.value = ""
    expenseAmount.value = ""
    message.textContent = ""
    expenseDate.value = ""
    expenseCategory.value = ""

    editingExpenseId = null
    addButton.textContent = "Add Expense"

    //  here i need to call the display function and calulate funtion
    displayExpenses()
    calculateTotal()

}

// function searchExpenses(){
//     const searchText = searchInput.value.toLowerCase().trim()
//     const filteredExpenses = expenses.filter(function(expense){
//         return expense.name.toLowerCase().includes(searchText)
//     })
//     displayExpenses(filteredExpenses)
// }

function filterExpenses(){
    const searchText = searchInput.value.toLowerCase().trim()
    const selectedCategory = filterCategory.value
    
    const filteredExpenses = expenses.filter(function(expense){

        const matchesSearch = expense.name.toLowerCase().includes(searchText)
        const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory
          
        return matchesCategory && matchesSearch
    })

    displayExpenses(filteredExpenses)
}

function displayExpenses(expensesToDisplay = expenses){
    expenseList.innerHTML = ""

    expensesToDisplay.forEach(function(expense){

        const li = document.createElement("li")
        li.classList.add("expense-item")

        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        const nameElement = document.createElement("span")
        nameElement.classList.add("expense-name")
        nameElement.textContent = expense.name

        const amountElement = document.createElement("span")
        amountElement.classList.add("expense-amount")
        amountElement.textContent = "$" + expense.amount

        const dateElement = document.createElement("span")
        dateElement.classList.add("expense-date")
        dateElement.textContent = expense.date

        const categoryElement = document.createElement("span")
        categoryElement.classList.add("expense-category")
        categoryElement.textContent = expense.category

        expenseInfo.appendChild(nameElement)
        expenseInfo.appendChild(amountElement)
        expenseInfo.appendChild(dateElement)
        expenseInfo.appendChild(categoryElement)

        const editButton = document.createElement("button")
        editButton.textContent = "Edit"
        editButton.classList.add("edit-btn")

        editButton.addEventListener("click", function (){
            editExpense(expense.id)

        })

        const deleteButton = document.createElement("button")
        deleteButton.textContent = "Delete"
        deleteButton.classList.add("delete-btn")

        deleteButton.addEventListener( "click", function (){
             deleteExpense(expense.id)

        })

        li.appendChild(expenseInfo)
        li.appendChild(deleteButton)
        li.appendChild(editButton)

        expenseList.appendChild(li)

    })
}

function editExpense(id){
    const expense = expenses.find(function(expense){
             return expense.id === id
    })

    editingExpenseId = id

    expenseName.value = expense.name
    expenseAmount.value = expense.amount
    expenseDate.value = expense.date
    expenseCategory.value = expense.category

    addButton.textContent = "Update expense"
    
}

function deleteExpense(id){
    expenses = expenses.filter(function(expense){
            return expense.id !== id
    })

    // after deleting it will prevent coming up on list
    localStorage.setItem("expenses", JSON.stringify(expenses))

    // displayExpenses()
    filterExpenses()
    // here i need to call the calculate function which will update after every deletion
    calculateTotal()

}

function calculateTotal(){
    let totalAmount = 0

    expenses.forEach(function(expense){
        totalAmount = totalAmount + expense.amount
    })

    total.textContent = "$" + totalAmount
}

displayExpenses()
calculateTotal()