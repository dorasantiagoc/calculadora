const form = document.getElementById('form-atividade');
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
const spanAprovado = '<span class="resultado aprovado">Passed</span>';
const spanReprovado = '<span class="resultado reprovado">Failed</span>';

// Load existing assignments on page load
document.addEventListener('DOMContentLoaded', () => {
    atualizaTabela();
    atualizaMediaFinal();
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    adicionaLinha();
});

function adicionaLinha() {
    const inputNomeAtividade = document.getElementById('nome-atividade');
    const inputNotaAtividade = document.getElementById('nota-atividade');

    if(assignments.some(assignment => assignment.nome === inputNomeAtividade.value)) {
        alert(`The assignment: ${inputNomeAtividade.value} has already been added.`);
        return;
    }

    const newAssignment = {
        nome: inputNomeAtividade.value,
        nota: parseFloat(inputNotaAtividade.value)
    };

    assignments.push(newAssignment);
    localStorage.setItem('assignments', JSON.stringify(assignments));

    atualizaTabela();
    atualizaMediaFinal();

    inputNomeAtividade.value = '';
    inputNotaAtividade.value = '';
}

function atualizaTabela() {
    const corpoTabela = document.querySelector('tbody');
    let linhas = '';

    assignments.forEach((assignment, index) => {
        let linha = '<tr>';
        linha += `<td>${assignment.nome}</td>`;
        linha += `<td>${assignment.nota}</td>`;
        linha += `<td>${assignment.nota >= 7 ? 'Passed' : 'Failed'}</td>`;
        linha += `<td><button class="delete-btn" onclick="deleteAssignment(${index})" title="Delete assignment">×</button></td>`;
        linha += '</tr>';
        linhas += linha;
    });

    corpoTabela.innerHTML = linhas;
}

function deleteAssignment(index) {
    assignments.splice(index, 1);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    atualizaTabela();
    atualizaMediaFinal();
}

function deleteAllAssignments() {
    if (assignments.length === 0) return;
    
    if (confirm('Are you sure you want to delete all assignments? This action cannot be undone.')) {
        assignments = [];
        localStorage.setItem('assignments', JSON.stringify(assignments));
        atualizaTabela();
        atualizaMediaFinal();
    }
}

function atualizaMediaFinal() {
    const mediaFinal = calculaMediaFinal();

    document.getElementById('media-final-valor').innerHTML = mediaFinal.toFixed(2);
    document.getElementById('media-final-resultado').innerHTML = mediaFinal >= 7 ? spanAprovado : spanReprovado;
}

function calculaMediaFinal() {
    if (assignments.length === 0) return 0;
    
    const somaDasNotas = assignments.reduce((total, assignment) => total + assignment.nota, 0);
    return somaDasNotas / assignments.length;
}