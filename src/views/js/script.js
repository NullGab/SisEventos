document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. CONTROLO DE INTERFACE (Transição de Telas)
    // ==========================================
    const btnSignUp = document.getElementById("btn-sign-up");
    const btnSignIn = document.getElementById("btn-sign-in");
    const body = document.body;

    if (btnSignUp && btnSignIn) {
        btnSignUp.addEventListener("click", (e) => {
            e.preventDefault();
            body.classList.add("sign-up-mode");
        });

        btnSignIn.addEventListener("click", (e) => {
            e.preventDefault();
            body.classList.remove("sign-up-mode");
        });
    }

    // ==========================================
    // CONFIGURAÇÃO DA API
    // ==========================================
    // Mude para 'true' quando o Javalin e o PostgreSQL estiverem a rodar
    const API_PRONTA = false; 
    const API_BASE_URL = "http://localhost:8080/api";

    // ==========================================
    // 2. LÓGICA DE REGISTO DE UTILIZADOR
    // ==========================================
    const registerForm = document.getElementById("registerForm");
    
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault(); 
            
            const nome = document.getElementById("nome").value;
            const sobrenome = document.getElementById("sobrenome").value;
            const email = document.getElementById("email-register").value;
            const senha = document.getElementById("password-register").value;
            const confirmarSenha = document.getElementById("password-confirm").value;

            if (senha !== confirmarSenha) {
                alert("As senhas não coincidem. Tente novamente.");
                return;
            }

            const nomeCompleto = `${nome} ${sobrenome}`.trim();

            if (!API_PRONTA) {
                // SIMULAÇÃO (MOCK)
                alert("(Mock) Conta criada com sucesso para " + nomeCompleto + "! Faça login para continuar.");
                registerForm.reset(); 
                body.classList.remove("sign-up-mode");
                return;
            }

            // INTEGRAÇÃO REAL
            try {
                const response = await fetch(`${API_BASE_URL}/usuarios/registrar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome: nomeCompleto, email: email, senha: senha })
                });

                if (response.ok) {
                    alert("Conta criada com sucesso! Por favor, faça login.");
                    registerForm.reset();
                    body.classList.remove("sign-up-mode");
                } else {
                    const errorMsg = await response.text();
                    alert("Erro ao criar conta: " + errorMsg);
                }
            } catch (error) {
                console.error("Erro de conexão:", error);
                alert("Não foi possível conectar ao servidor.");
            }
        });
    }

    // ==========================================
    // 3. LÓGICA DE LOGIN
    // ==========================================
    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const email = document.getElementById("email-login").value;
            const senha = document.getElementById("password-login").value;

            if (!API_PRONTA) {
                // SIMULAÇÃO (MOCK)
                const usuarioMock = { 
                    id: "usu-999", 
                    nome: "Gabriel Costa", 
                    email: email 
                };
                localStorage.setItem("usuarioLogado", JSON.stringify(usuarioMock));
                window.location.href = "painel.html"; 
                return;
            }

            // INTEGRAÇÃO REAL
            try {
                const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email, senha: senha })
                });

                if (response.ok) {
                    const userData = await response.json();
                    localStorage.setItem("usuarioLogado", JSON.stringify(userData));
                    window.location.href = "painel.html"; 
                } else {
                    alert("E-mail ou senha incorretos.");
                }
            } catch (error) {
                console.error("Erro de conexão:", error);
                alert("Não foi possível conectar ao servidor.");
            }
        });
    }
});
