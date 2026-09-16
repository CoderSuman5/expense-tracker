let expenses = JSON.parse(localStorage.getItem("expenses")) || []

const expenseName = document.getElementById("expanseName")
const expenseAmount = document.getElementById("expanseAmount")
const addButton = document.getElementById("addBtn")
const expenseList = document.getElementById("expenseList")
const total = document.getElementById("total")
const message = document.getElementById("message")

addButton.addEventListener("click", addExpense)

function addExpense(){
    const name = expenseName.value.trim()
    const amount = Number(expenseAmount.value)

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

    const expense = {
        id: Date.now(),
        name: name,
        amount: amount 
    }

    expenses.push(expense)

    // saving items in local stroge for better memory function
    localStorage.setItem("expenses", JSON.stringify(expenses))

    expenseName.value = ""
    expenseAmount.value = ""
    message.textContent = ""

    //  here i need to call the display function and calulate funtion
    displayExpenses()
    calculateTotal()

}

function displayExpenses(){
    expenseList.innerHTML = ""

    expenses.forEach(function(expense){

        const li = document.createElement("li")
        li.classList.add("expense-item")

        const expneseInfo = document.createElement("div")
        expneseInfo.classList.add("expense-info")

        const nameElement = document.createElement("span")
        nameElement.classList.add("expense-name")
        nameElement.textContent = expense.name

        const amountElement = document.createElement("span")
        amountElement.classList.add("expense-amount")
        amountElement.textContent = "$" + expense.amount

        expneseInfo.appendChild(nameElement)
        expneseInfo.appendChild(amountElement)

        const deleteButton = document.createElement("button")
        deleteButton.textContent = "Delete"
        deleteButton.classList.add("delete-btn")

        deleteButton.addEventListener( "click", function (){
             deleteExpense(expense.id)

        })

        li.appendChild(expneseInfo)
        li.appendChild(deleteButton)

        expenseList.appendChild(li)

    })
}

function deleteExpense(id){
    expenses = expenses.filter(function(expense){
            return expense.id !== id
    })

    // after deleting it will prevent coming up on list
    localStorage.setItem("expenses", JSON.stringify(expenses))

    displayExpenses()
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

