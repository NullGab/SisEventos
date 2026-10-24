document.addEventListener("DOMContentLoaded", () => {
    
    // Alterne para true quando a API estiver pronta
    const API_PRONTA = false; 
    const API_BASE_URL = "http://localhost:8080/api";

    // Elementos da tela
    const gridEventos = document.getElementById("grid-eventos");
    const saudacaoUsuario = document.getElementById("saudacao-usuario");
    const btnSair = document.getElementById("btn-sair");

    // 1. Recuperar dados do Utilizador logado
    const usuarioString = localStorage.getItem("usuarioLogado");
    let usuarioId = null;

    if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        // Exibe o nome do utilizador, ou um fallback se estiver a testar sem login
        saudacaoUsuario.textContent = `Bem-vindo, ${usuario.nome || 'Participante'}. Escolha os seus próximos eventos.`;
        usuarioId = usuario.id;
    } else {
        saudacaoUsuario.textContent = "Bem-vindo. Escolha os seus próximos eventos.";
    }

    // 2. Lógica de Logout
    if (btnSair) {
        btnSair.addEventListener("click", () => {
            localStorage.removeItem("usuarioLogado");
            window.location.href = "index.html"; // Volta para a tela de login
        });
    }

    // 3. Carregar Lista de Eventos
    async function carregarEventos() {
        try {
            let eventos = [];

            if (API_PRONTA) {
                const response = await fetch(`${API_BASE_URL}/eventos`);
                if (!response.ok) throw new Error("Falha ao buscar eventos");
                eventos = await response.json();
            } else {
                // MOCK: Simulando o retorno do EventoDTO do backend
                eventos = [
                    {
                        id: "evt-001",
                        titulo: "V Simpósio de Sistemas de Informação",
                        dataInicio: "2026-11-10T08:00:00",
                        dataFim: "2026-11-12T18:00:00",
                        criador: "Centro Académico"
                    },
                    {
                        id: "evt-002",
                        titulo: "Workshop de Integração Contínua e NixOS",
                        dataInicio: "2026-11-20T14:00:00",
                        dataFim: "2026-11-20T18:00:00",
                        criador: "Departamento de TI"
                    },
                    {
                        id: "evt-003",
                        titulo: "Hackathon da Saúde Pública",
                        dataInicio: "2026-12-05T09:00:00",
                        dataFim: "2026-12-06T17:00:00",
                        criador: "Prefeitura Municipal"
                    }
                ];
            }

            renderizarEventos(eventos);

        } catch (error) {
            console.error(error);
            gridEventos.innerHTML = `<p style="color: red;">Erro ao carregar os eventos. Verifique a consola.</p>`;
        }
    }

    // 4. Renderizar o HTML
    function renderizarEventos(eventos) {
        gridEventos.innerHTML = ""; 

        if (eventos.length === 0) {
            gridEventos.innerHTML = "<p>Nenhum evento disponível no momento.</p>";
            return;
        }

        eventos.forEach(evento => {
            const dataInicioFormatada = new Date(evento.dataInicio).toLocaleDateString('pt-PT');
            const horaInicioFormatada = new Date(evento.dataInicio).toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'});

            const cartaoHTML = `
                <div class="card">
                    <h3 class="card-title">${evento.titulo}</h3>
                    <div class="card-info">
                        <strong>Início:</strong> ${dataInicioFormatada} às ${horaInicioFormatada}
                    </div>
                    <div class="card-info">
                        <strong>Organização:</strong> ${evento.criador}
                    </div>
                    <div class="card-actions">
                        <button onclick="realizarInscricao('${evento.id}')" class="btn-primary">Realizar Inscrição</button>
                    </div>
                </div>
            `;
            gridEventos.innerHTML += cartaoHTML;
        });
    }

    carregarEventos();
});

// 5. Função global para o botão do cartão
window.realizarInscricao = async function(eventoId) {
    const API_PRONTA = false;
    const usuarioString = localStorage.getItem("usuarioLogado");
    
    if (!usuarioString && API_PRONTA) {
        alert("Precisa de estar logado para se inscrever.");
        return;
    }

    if (API_PRONTA) {
        try {
            const usuario = JSON.parse(usuarioString);
            const response = await fetch(`http://localhost:8080/api/inscricoes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuarioId: usuario.id,
                    eventoId: eventoId
                })
            });

            if (response.ok) {
                alert("Inscrição realizada com sucesso! Verifique 'A minha Agenda' para escolher as atividades.");
            } else {
                const erro = await response.text();
                alert("Erro: " + erro);
            }
        } catch (error) {
            alert("Erro de conexão com o servidor.");
        }
    } else {
        // Simulação da lógica que você criou no ConfirmarInscricaoUseCase
        alert(`(Mock) Inscrição recebida no evento [${eventoId}]. Em produção, isto chamará o InscricaoController.`);
    }
};
