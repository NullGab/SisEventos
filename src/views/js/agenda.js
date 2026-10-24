document.addEventListener("DOMContentLoaded", () => {
    
    const API_PRONTA = false; // Mude para true quando integrar com Javalin
    const API_BASE_URL = "http://localhost:8080/api";

    const gridAgenda = document.getElementById("grid-agenda");
    const btnSair = document.getElementById("btn-sair");

    // 1. Verificação de Segurança (Garante que só acessa quem está logado)
    const usuarioString = localStorage.getItem("usuarioLogado");
    if (!usuarioString) {
        alert("Você precisa estar logado para ver sua agenda.");
        window.location.href = "index.html";
        return;
    }
    const usuario = JSON.parse(usuarioString);

    // 2. Lógica de Logout
    if (btnSair) {
        btnSair.addEventListener("click", () => {
            localStorage.removeItem("usuarioLogado");
            window.location.href = "index.html";
        });
    }

    // 3. Carregar Lista de Atividades do Usuário
    async function carregarAgenda() {
        try {
            let atividades = [];

            if (API_PRONTA) {
                // Aqui chamará a rota que devolve a List<AtividadeDTO>
                const response = await fetch(`${API_BASE_URL}/usuarios/${usuario.id}/agenda`);
                if (!response.ok) throw new Error("Falha ao buscar agenda");
                atividades = await response.json();
            } else {
                // MOCK: Simulando o retorno do AtividadeDTO
                atividades = [
                    {
                        id: "ativ-101",
                        titulo: "Palestra: Arquitetura Hexagonal na Prática",
                        dataHoraInicio: "2026-11-10T09:00:00",
                        dataHoraFim: "2026-11-10T11:00:00",
                        local: "Auditório Principal"
                    },
                    {
                        id: "ativ-102",
                        titulo: "Minicurso: Padrões de Projeto (POO)",
                        dataHoraInicio: "2026-11-10T14:00:00",
                        dataHoraFim: "2026-11-10T18:00:00",
                        local: "Laboratório 3"
                    },
                    {
                        id: "ativ-103",
                        titulo: "Mesa Redonda: Desafios em Sistemas de Informação",
                        dataHoraInicio: "2026-11-11T10:00:00",
                        dataHoraFim: "2026-11-11T12:00:00",
                        local: "Sala 204 - Bloco B"
                    }
                ];
            }

            renderizarAgenda(atividades);

        } catch (error) {
            console.error(error);
            gridAgenda.innerHTML = `<p style="color: #dc2626;">Erro ao carregar sua agenda. Tente novamente mais tarde.</p>`;
        }
    }

    // 4. Renderizar o HTML na tela
    function renderizarAgenda(atividades) {
        gridAgenda.innerHTML = ""; 

        if (atividades.length === 0) {
            gridAgenda.innerHTML = "<p>Sua agenda está vazia. Vá até a aba 'Eventos' para se inscrever e adicionar atividades.</p>";
            return;
        }

        atividades.forEach(ativ => {
            // Tratamento das datas e horas para o padrão brasileiro
            const dataInicio = new Date(ativ.dataHoraInicio);
            const dataFormatada = dataInicio.toLocaleDateString('pt-BR');
            const horaInicio = dataInicio.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            
            const dataFim = new Date(ativ.dataHoraFim);
            const horaFim = dataFim.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});

            const cartaoHTML = `
                <div class="card">
                    <h3 class="card-title">${ativ.titulo}</h3>
                    <div class="card-info">
                        <strong>Data:</strong> ${dataFormatada}
                    </div>
                    <div class="card-info">
                        <strong>Horário:</strong> ${horaInicio} às ${horaFim}
                    </div>
                    <div class="card-info">
                        <strong>Local:</strong> ${ativ.local}
                    </div>
                    <div class="card-actions">
                        <!-- Botão com cor invertida/destacada para remoção -->
                        <button onclick="removerAtividade('${ativ.id}')" class="btn-secondary" style="color: #dc2626; border-color: #fca5a5;">
                            Remover da Agenda
                        </button>
                    </div>
                </div>
            `;
            gridAgenda.innerHTML += cartaoHTML;
        });
    }

    // Inicia a carga de dados
    carregarAgenda();
});

// 5. Ação do botão de remover atividade
window.removerAtividade = async function(atividadeId) {
    const API_PRONTA = false; // Mude para true quando for integrar
    
    const confirmacao = confirm("Tem certeza que deseja remover esta atividade da sua agenda?");
    if (!confirmacao) return;

    if (API_PRONTA) {
        try {
            const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
            // Rota hipotética para desvincular a atividade da inscrição
            const response = await fetch(`http://localhost:8080/api/inscricoes/${usuario.id}/atividades/${atividadeId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                alert("Atividade removida com sucesso.");
                window.location.reload(); // Recarrega a página para atualizar a lista
            } else {
                const erro = await response.text();
                alert("Erro ao remover: " + erro);
            }
        } catch (error) {
            alert("Erro de conexão com o servidor.");
        }
    } else {
        alert(`(Mock) Solicitação para remover atividade [${atividadeId}] processada. Na versão real, o item sumirá da lista.`);
    }
};
