$(document).ready(function () {
    $('#formLogin').submit(function (event) {
        const modalLogin = new bootstrap.Modal('#modalLogin');
        event.preventDefault();

        // Realizar a validação do formulário usando o Bootstrap
        if (this.checkValidity() === false) {
            return;
        }

        let credenciais = {
            username: document.getElementById("username").value,
            senha: document.getElementById("senha").value,
        };

        postCredenciais((credenciais), function (matchCredencial, response) {
            if (matchCredencial) {
                localStorage.setItem('usuario', JSON.stringify(response));
                window.location.href = './pages/principal.html'
            } else modalLogin.show();
        });
    });

    $('#formCadastro').submit(function (event) {

        event.preventDefault();

        if (this.checkValidity() === false) return;
        let username = document.getElementById("username").value;
        let nome = document.getElementById("nome").value;
        let email = document.getElementById("email").value;
        let senha = document.getElementById("senha").value;

        if (!username.match(/^[a-zA-Z0-9]{5,15}$/)) {
            mensagem = "O nome de usuário deve conter de 5 a 15 caracteres, apenas letras ou números.";
            document.getElementById("username").focus();
            exibirModalErro(mensagem);
            return;
        } else if (!nome.match(/^[a-zA-ZÀ-ú\s]{5,}$/)) {
            mensagem = "O nome deve ter no mínimo 5 caracteres, todos sendo letras.";
            document.getElementById("nome").focus();
            exibirModalErro(mensagem);
            return;
        } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            mensagem = "O email inserido não é válido.";
            document.getElementById("email").focus();
            exibirModalErro(mensagem);
            return;
        } else if (!senha.match(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
            mensagem = "A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas e minúsculas.";
            document.getElementById("senha").focus();
            exibirModalErro(mensagem);
            return;
        }

        getVerificaUsuario(username, function (usernameDisponivel) {
            if (!usernameDisponivel) {
                exibirModalErro("O nome inserido já se encontra em uso.")
            } else {
                const modalSucesso = new bootstrap.Modal('#modalSucesso');
                let usuario = {
                    username: username.toLowerCase(),
                    nome: nome.toUpperCase(),
                    email: email.toLowerCase(),
                    senha: senha,
                    admin: document.getElementById('ehAdmin').checked
                }
                postNovoUsuario(usuario, function (usuarioCriado) {
                    if (usuarioCriado) {
                        modalSucesso.show()
                    } else exibirModalErro('Ocorreu um erro ao criar o usuário.')
                })
            }
            ;
        });

        function exibirModalErro(mensagem) {
            const modalCadastro = new bootstrap.Modal('#modalFalhaCadastro');
            const mensagemErro = document.getElementById('mensagemModal');
            mensagemErro.textContent = mensagem;
            modalCadastro.show();
        }

    });

    $('#formCategoria').submit(function (event) {

        event.preventDefault();
        if (this.checkValidity() === false) return;

        let categoria = {
            categoria: document.getElementById("categoria").value.toLowerCase(),
            descricao: document.getElementById("descricao").value
        }

        postNovaCategoria((categoria), function (sucesso, response) {
            if (sucesso) {
                exibirModal('Categoria criada!', 'Categoria de id n°' + response.id + " criada com sucesso.");
                $('#formCategoria')[0].reset();
            } else {
                exibirModal('Erro ao adicionar ', 'Ocorreu um erro ao adicionar a categoria. Tente novamente mais tarde.');
            }
        });

        function exibirModal(titulo, mensagem) {
            const modalNovaCategoria = new bootstrap.Modal('#modalNovaCategoria');
            const mensagemModal = document.getElementById('mensagemModal');
            const tituloModal = document.getElementById('tituloModal');
            mensagemModal.textContent = mensagem;
            tituloModal.textContent = titulo;
            modalNovaCategoria.show();
        }
    });

    $('#formEvento').submit(function (event) {

        event.preventDefault();
        if (this.checkValidity() === false) return;
        const radioButtons = document.getElementsByName('radioModalidade');

        let dataInicio = document.getElementById("dtInicio").value;
        let dataFinal = document.getElementById("dtFim").value;

        if (!validaDatas(dataInicio, dataFinal)) {
            exibirModal('Data inválida', 'As datas devem atender aos seguintes critérios:\n\nA data inicial deve ser igual ou posterior à 01/01/2002;\nA data final deve ser igual ou anterior à 01/01/2099;\nA data inicial deve ser anterior ou igual à data final.');
            return;
        }

        let evento = {
            titulo: document.getElementById("titulo").value.toUpperCase(),
            descricao: document.getElementById("descricao").value,
            categoria: parseInt(document.getElementById('categoria').value),
            usuario: document.getElementById("autor").value,
            dataInicial: converterDataFormato(dataInicio),
            dataFinal: converterDataFormato(dataFinal)
        };

        radioButtons.forEach(function (radio) {
            if (radio.checked) {
                evento.modalidade = radio.value;
            }
        });

        postNovoEvento((evento), function (sucesso, response) {
            if (sucesso) {
                exibirModal('Evento criado!', 'Evento de id n°' + response.id + " evento com sucesso.");
                $('#formEvento')[0].reset();
                document.getElementById("autor").value = dadosUsuario.username;
            } else {
                exibirModal('Erro ao adicionar ', 'Ocorreu um erro ao adicionar a evento. Tente novamente mais tarde.');
            }
        });

        function exibirModal(titulo, mensagem) {
            const modalNovaEvento = new bootstrap.Modal('#modalNovoEvento');
            const mensagemModal = document.getElementById('mensagemModal');
            const tituloModal = document.getElementById('tituloModal');
            mensagem = mensagem.replace(/\n/g, '<br>');
            mensagemModal.innerHTML = mensagem;
            tituloModal.textContent = titulo;
            modalNovaEvento.show();
        }
    });

});
