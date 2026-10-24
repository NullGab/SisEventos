document.addEventListener("DOMContentLoaded", () => {
    
    const API_PRONTA = false; // Mude para true quando integrar com Javalin
    const API_BASE_URL = "http://localhost:8080/api";

    const gridHistorico = document.getElementById("grid-historico");
    const btnSair = document.getElementById("btn-sair");

    // 1. Verificação de Segurança
    const usuarioString = localStorage.getItem("usuarioLogado");
    if (!usuarioString) {
        alert("Você precisa estar logado para ver seu histórico.");
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

    // 3. Carregar Histórico do Usuário
    async function carregarHistorico() {
        try {
            let historico = [];

            if (API_PRONTA) {
                // Rota que busca o histórico consolidado de presenças
                const response = await fetch(`${API_BASE_URL}/usuarios/${usuario.id}/historico`);
                if (!response.ok) throw new Error("Falha ao buscar histórico");
                historico = await response.json();
            } else {
                // MOCK: Simulando o retorno da API
                historico = [
                    {
                        id: "hist-001",
                        atividadeTitulo: "Palestra: Arquitetura Hexagonal na Prática",
                        eventoTitulo: "V Simpósio de Sistemas de Informação",
                        dataTermino: "2026-11-10T11:00:00",
                        cargaHoraria: 2,
                        status: "PRESENTE" // Liberou certificado
                    },
                    {
                        id: "hist-002",
                        atividadeTitulo: "Minicurso: Padrões de Projeto (POO)",
                        eventoTitulo: "V Simpósio de Sistemas de Informação",
                        dataTermino: "2026-11-10T18:00:00",
                        cargaHoraria: 4,
                        status: "PRESENTE" // Liberou certificado
                    },
                    {
                        id: "hist-003",
                        atividadeTitulo: "Mesa Redonda: Banco de Dados",
                        eventoTitulo: "V Simpósio de Sistemas de Informação",
                        dataTermino: "2026-11-11T12:00:00",
                        cargaHoraria: 2,
                        status: "AUSENTE" // Faltou, não tem certificado
                    }
                ];
            }

            renderizarHistorico(historico);

        } catch (error) {
            console.error(error);
            gridHistorico.innerHTML = `<p style="color: #dc2626;">Erro ao carregar seu histórico.</p>`;
        }
    }

    // 4. Renderizar o HTML
    function renderizarHistorico(historico) {
        gridHistorico.innerHTML = ""; 

        if (historico.length === 0) {
            gridHistorico.innerHTML = "<p>Nenhum histórico encontrado. Participe de eventos para gerar certificados.</p>";
            return;
        }

        historico.forEach(item => {
            const dataFim = new Date(item.dataTermino).toLocaleDateString('pt-BR');
            
            // Lógica condicional: só mostra o botão de certificado se estiver PRESENTE
            let acoesHTML = "";
            let statusHTML = "";

            if (item.status === "PRESENTE") {
                statusHTML = `<span style="color: #16a34a; font-weight: 700;">Participação Confirmada</span>`;
                acoesHTML = `
                    <div class="card-actions">
                        <button onclick="baixarCertificado('${item.id}')" class="btn-primary" style="background-color: #16a34a;">
                            Baixar Certificado
                        </button>
                    </div>
                `;
            } else {
                statusHTML = `<span style="color: #dc2626; font-weight: 700;">Ausente</span>`;
                acoesHTML = `
                    <div class="card-actions">
                        <button disabled class="btn-secondary" style="opacity: 0.5; cursor: not-allowed;">
                            Certificado Indisponível
                        </button>
                    </div>
                `;
            }

            const cartaoHTML = `
                <div class="card">
                    <h3 class="card-title">${item.atividadeTitulo}</h3>
                    <div class="card-info" style="font-size: 0.85rem; color: #6b7280; margin-bottom: 1rem;">
                        ${item.eventoTitulo}
                    </div>
                    <div class="card-info">
                        <strong>Data de Conclusão:</strong> ${dataFim}
                    </div>
                    <div class="card-info">
                        <strong>Carga Horária:</strong> ${item.cargaHoraria} horas
                    </div>
                    <div class="card-info" style="margin-top: 0.5rem;">
                        <strong>Status:</strong> ${statusHTML}
                    </div>
                    ${acoesHTML}
                </div>
            `;
            gridHistorico.innerHTML += cartaoHTML;
        });
    }

    // Inicializa a tela
    carregarHistorico();
});

// 5. Função para gerar/baixar o certificado
window.baixarCertificado = async function(historicoId) {
    const API_PRONTA = false; // Mude para true quando for integrar
    
    if (API_PRONTA) {
        try {
            // Em uma aplicação real, essa rota devolveria um PDF
            // window.open(`${API_BASE_URL}/certificados/gerar/${historicoId}`, '_blank');
            alert(`Requisição para gerar certificado ${historicoId} enviada para o backend.`);
        } catch (error) {
            alert("Erro ao tentar gerar o certificado.");
        }
    } else {
        alert(`(Mock) Simulando a geração do certificado PDF para o registro [${historicoId}].\nAqui o Javalin vai processar um JasperReports ou uma biblioteca PDF e devolver o arquivo pronto.`);
    }
};
