const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    carregarContas();
});

function switchTab(tipo) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`tab-${tipo}`).classList.add('active');
    ocultarMensagem();
}

async function carregarContas() {
    try {
        const res = await fetch(`${API_URL}/contas`);
        const contas = await res.json();
        
        renderizarContas(contas);
        atualizarSelects(contas);
    } catch (error) {
        mostrarMensagem('Erro ao conectar com o backend. Certifique-se de que ele está rodando na porta 3000.', true);
    }
}

function renderizarContas(contas) {
    const container = document.getElementById('contas-lista');
    container.innerHTML = '';

    contas.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${c.titular}</h3>
            <span class="badge">${c.tipo}</span>
            <div class="saldo">R$ ${c.saldo.toFixed(2)}</div>
            <small style="color: var(--text-secondary)">ID: ${c.id}</small>
        `;
        container.appendChild(card);
    });
}

function atualizarSelects(contas) {
    const saqueSelect = document.getElementById('saque-conta');
    const origemSelect = document.getElementById('trans-origem');
    const destinoSelect = document.getElementById('trans-destino');

    saqueSelect.innerHTML = '';
    origemSelect.innerHTML = '';
    destinoSelect.innerHTML = '';

    contas.forEach(c => {
        const opt = `<option value="${c.id}">${c.titular} (${c.tipo})</option>`;
        saqueSelect.innerHTML += opt;
        origemSelect.innerHTML += opt;
        destinoSelect.innerHTML += opt;
    });
}

async function executarSaque(e) {
    e.preventDefault();
    const id = document.getElementById('saque-conta').value;
    const valor = parseFloat(document.getElementById('saque-valor').value);

    try {
        const res = await fetch(`${API_URL}/contas/${id}/saque`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valor })
        });

        const dados = await res.json();

        if (!res.ok) {
            mostrarMensagem(dados.erro, true);
        } else {
            mostrarMensagem(dados.mensagem, false);
            document.getElementById('form-saque').reset();
            carregarContas();
        }
    } catch (error) {
        mostrarMensagem('Falha ao processar o saque.', true);
    }
}

async function executarTransferencia(e) {
    e.preventDefault();
    const origemId = document.getElementById('trans-origem').value;
    const destinoId = document.getElementById('trans-destino').value;
    const valor = parseFloat(document.getElementById('trans-valor').value);

    try {
        const res = await fetch(`${API_URL}/transferencia`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origemId, destinoId, valor })
        });

        const dados = await res.json();

        if (!res.ok) {
            mostrarMensagem(dados.erro, true);
        } else {
            mostrarMensagem(dados.mensagem, false);
            document.getElementById('form-transferencia').reset();
            carregarContas();
        }
    } catch (error) {
        mostrarMensagem('Falha ao processar a transferência.', true);
    }
}

function mostrarMensagem(texto, isErro) {
    const msgDiv = document.getElementById('mensagem');
    msgDiv.innerText = texto;
    msgDiv.className = isErro ? 'erro' : 'sucesso';
    msgDiv.style.display = 'block';
}

function ocultarMensagem() {
    const msgDiv = document.getElementById('mensagem');
    if (msgDiv) msgDiv.style.display = 'none';
}