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

        postCredenciais((credenciais), function (matchCredencial) {
            if (matchCredencial) {
                window.location.href = '../pages/principal.html'
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

        getVerificaUsuario(username, function (usernameDisponivel){
            if (!usernameDisponivel) {
                exibirModalErro("O nome inserido já se encontra em uso.")
            } else{
                let usuario = {
                    username: username.toLowerCase(),
                    nome: nome.toUpperCase(),
                    email: email.toLowerCase(),
                    senha: senha,
                    admin: document.getElementById('ehAdmin').checked
                }
                postNovoUsuario(usuario, )
            };
        });


        function exibirModalErro(mensagem) {
            const modalCadastro = new bootstrap.Modal('#modalFalhaCadastro');
            const mensagemErro = document.getElementById('mensagemModal');
            mensagemErro.textContent = mensagem;
            modalCadastro.show();
        }




    });

});
