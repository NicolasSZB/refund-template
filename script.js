// Seleciona os elementos do formulario
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor
amount.oninput = () => {
    // Obtem o valor atual do input, removendo todos os caracteres nao numericos
    let value = amount.value.replace(/\D/g, "")

    // Transforma o valor em numero e divide por 100 para considerar os centavos
    value = Number(value) / 100

    // Atualiza o valor do input com a formatacao correta
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
    // Formata o valor como moeda brasileira
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    // Retorna o valor formatado
    return value
}

// Captura o evento de submit do formulario
form.onsubmit = (event) => {
    // Previne o comportamento padrao de envio do formulario
    event.preventDefault()

    // Cria um novo objeto de despesa com os valores do formulario
    const newExpense = {
        id: new Date().getTime(),  
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    expenseAdd(newExpense)
}

// Adiciona um novo item na lista
function expenseAdd(newExpense){
    try {
        // Cria o elemento para adicionar na lista
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // Cria o icone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        // Cria as informacoes da despesa
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // Cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        // Cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        // Adiciona o nome e a categoria na informacao
        expenseInfo.append(expenseName, expenseCategory)

        // Cria o valor da despesa
        expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
            .toUpperCase()
            .replace("R$", "")}`

        // Cria o icone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")

        // Adiciona as informacoes no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        // Adiciona o item na lista
        expenseList.append(expenseItem)
        clearForm()
        updateTotals()
    } catch (error){
        alert("Nao foi possivel atualizar a lista de despesas.")
        console.log(error)
    }
}

// Atualiza os totais
function updateTotals(){
    try {
        // Recupera todos os items da lista
        const items = expenseList.children

        // Atualiza a quantidade de despesas
        expensesQuantity.textContent = `${items.length} ${
            items.length > 1 ? "despesas" : "despesa"
        }`

        // Variavel para incrementar o total
        let total = 0

        // Percorre cada item da lista
        for(let item = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")

            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            // Converte o valor para float
            value = parseFloat(value)

            // Verifica se é um numero valido
            if(isNaN(value)){
                return alert("Valor invalido encontrado.")
            }

            total += Number(value)
        }

        // Cria a span para adicionar o R$ formatado
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // Formata o valor e remove o R$ que será exbido pela small com um estilo customizado
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        // Limpa o conteudo do elemento
        expensesTotal.innerHTML = ""

        // Adiciona o simbolo e o total formatado
        expensesTotal.append(symbolBRL, total)
    } catch(error){
        alert("Nao foi possivel atualizar os totais.")
        console.log(error)
    }
}

// Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-icon")){
        // Obtem a li pai do elemento clicado
        const item = event.target.closest(".expense")

        // Remove o item da lista
        item.remove()
    }

    // Atualiza os totais depois do item ser removido
    updateTotals()
})

function clearForm(){
    // Limpa os inputs
    expense.value = ""
    category.value = ""
    amount.value = "" 

    // Foca no input de despesa
    expense.focus()
}