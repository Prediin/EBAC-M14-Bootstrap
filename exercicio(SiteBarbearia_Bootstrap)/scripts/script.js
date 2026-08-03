document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("#formularioContato");
    const botaoEnviar = document.querySelector("#botaoEnviar");
    const textoBotao = document.querySelector("#textoBotao");
    const iconeCarregamento = document.querySelector("#iconeCarregamento");
    const mensagemFormulario = document.querySelector("#mensagemFormulario");

    const emailDestino = "lgf.predo@gmail.com";

    const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(
        emailDestino
    )}`;

    function mostrarMensagem(tipo, texto) {
        mensagemFormulario.className = `alert alert-${tipo} mb-4`;
        mensagemFormulario.textContent = texto;

        mensagemFormulario.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    function limparMensagem() {
        mensagemFormulario.className = "d-none";
        mensagemFormulario.textContent = "";
    }

    function alterarEstadoEnvio(enviando) {
        botaoEnviar.disabled = enviando;

        iconeCarregamento.classList.toggle(
            "d-none",
            !enviando
        );

        textoBotao.textContent = enviando
            ? "Enviando..."
            : "Enviar mensagem";
    }

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        limparMensagem();

        if (!formulario.checkValidity()) {
            formulario.classList.add("was-validated");

            mostrarMensagem(
                "warning",
                "Confira os campos destacados antes de enviar a mensagem."
            );

            return;
        }

        if (
            emailDestino === "SEU_EMAIL@EXEMPLO.COM" ||
            !emailDestino.includes("@")
        ) {
            mostrarMensagem(
                "warning",
                "Configure um e-mail de destino válido no código antes de enviar."
            );

            return;
        }

        alterarEstadoEnvio(true);

        try {
            const dadosFormulario = new FormData(formulario);

            const resposta = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Accept: "application/json"
                },
                body: dadosFormulario
            });

            const resultado = await resposta
                .json()
                .catch(() => null);

            if (!resposta.ok) {
                throw new Error(
                    resultado?.message ||
                    "O servidor não conseguiu receber a mensagem."
                );
            }

            mostrarMensagem(
                "success",
                "Mensagem enviada com sucesso! Entraremos em contato em breve."
            );

            formulario.reset();
            formulario.classList.remove("was-validated");
        } catch (erro) {
            console.error(
                "Erro ao enviar o formulário:",
                erro
            );

            mostrarMensagem(
                "danger",
                "Não foi possível enviar sua mensagem. Verifique sua conexão e tente novamente."
            );
        } finally {
            alterarEstadoEnvio(false);
        }
    });

    formulario.addEventListener("input", () => {
        if (formulario.classList.contains("was-validated")) {
            formulario.checkValidity();
        }
    });
});