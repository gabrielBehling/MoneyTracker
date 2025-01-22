let receitas = 0;
let despesas = 0;

let form = document.querySelector('form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    addDescription();
    
    document.querySelector('form').reset();
});

function addDescription() {
    let ul = document.querySelector('ul');
    let li = document.createElement('li');
    let description = document.querySelector('#descricao').value;
    let value = document.querySelector('#valor').value;
    value = parseFloat(value);
    li.innerHTML = `<span class="descricao">${description}</span>
                <span class="value">R$ ${value.toFixed(2)}</span>
                <button class="deleteButton">&#x24E7</button>`;
    
    let descriptionType = document.querySelector('input[name="tipo"]:checked').value;
    if (descriptionType == 'receita') {
        li.classList.add('receita');
        receitas += value;
    } else {
        li.classList.add('despesa');
        despesas += value;
    }
    li.querySelector('.deleteButton').addEventListener('click', function() {
        removeDescription(li, value, descriptionType);
    });
    ul.appendChild(li);

    updateStats();
}

function removeDescription(li, value, descriptionType) {
    li.remove();
    if (descriptionType == 'receita') {
        receitas -= value;
    } else {
        despesas -= value;
    }
    updateStats();
}

function updateStats() {
    let saldoSpan = document.querySelector('#saldo');
    let receitasSpan = document.querySelector('#receita');
    let despesasSpan = document.querySelector('#despesas');
    saldoSpan.innerHTML = `R$ ${(receitas - despesas).toFixed(2)}`;
    receitasSpan.innerHTML = `R$ ${receitas.toFixed(2)}`;
    despesasSpan.innerHTML = `R$ ${despesas.toFixed(2)}`;
}