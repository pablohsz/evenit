$(document).ready(function () {
    $('#formLogin').submit(function (event) {
        const modalLogin = new bootstrap.Modal('#modalLogin');
        event.preventDefault();

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
                window.location.href = '/evenit/pages/principal.html'
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

    //Página de Categorias

    $('#formPesquisaSimples').submit(function (event) {
        event.preventDefault();

        if (this.checkValidity() === false) {
            return;
        }

        let id = document.getElementById('idBuscado').value;
        let categorias = [];

        getCategorias(function (sucesso, response) {
            if (sucesso) {
                if (id != '') {
                    let regex = new RegExp(id, 'gmi');
                    response.forEach(categoria => {
                        if (categoria['id'].toString().match(regex) != null) {
                            categorias.push(categoria);
                        }
                    });
                } else {
                    categorias = response;
                }
                console.log(categorias);
                listarCategorias(categorias);
            } else {
                exibirMensagemCategoria('Ocorreu um erro na conexão com o servidor.')
            }
        });

    });

    $('#formCategoria').submit(function (event) {

        let nome = document.getElementById("inputCategoria").value;

        event.preventDefault();
        if (this.checkValidity() === false) return;
        else if (!validarCampo(nome, 'texto')){
            toastErroEvento('O nome da categoria deve conter no mínimo 5 caracteres, aceitando letras, números e hífens (-).');
            nome.focus();
            return;
        };

        let categoria = {
            categoria: nome.toLowerCase(),
            descricao: document.getElementById("inputDescricao").value
        }

        postNovaCategoria((categoria), function (sucesso, response) {
            if (sucesso) {
                exibirToastCategoria('Categoria de id n°' + response.id + ' criada com sucesso.');
                $('#cadastroCategoriaModal').modal('hide');
                todasAsCategorias();
            } else {
                exibirToastCategoria('Ocorreu um erro ao adicionar a categoria. Tente novamente mais tarde.');
            }
        });


    });

    $('#formEdicaoCategoria').submit(function (event) {

        let nome = document.getElementById("categoriaEdicao").value;

        event.preventDefault();
        if (this.checkValidity() === false) return;
        else if (!validarCampo(nome, 'texto')){
            toastErroEvento('O nome da categoria deve conter no mínimo 5 caracteres, aceitando letras, números e hífens (-).');
            nome.focus();
            return;
        };

        let categoria = {
            id: parseInt(document.getElementById("idEdicao").value),
            categoria: nome.toLowerCase(),
            descricao: document.getElementById("descricaoEdicao").value
        }

        patchCategoria((categoria), function (sucesso, response) {
            if (sucesso) {
                exibirToastCategoria('Categoria de id n°' + response.id + ' atualizada com sucesso.');
                $('#edicaoCategoriaModal').modal('hide');
                todasAsCategorias();
            } else {
                exibirToastCategoria('Ocorreu um erro ao salvar a categoria. Tente novamente mais tarde.');
            }
        });


    });

    $('#cadastroCategoriaModal').on('hidden.bs.modal', function (e) {
        $('#formCategoria')[0].reset();
    });

    $('#confirmarExclusaoCategoria').click(function () {
        let btnConfirmacao = document.getElementById('confirmarExclusaoCategoria');
        let id = btnConfirmacao.getAttribute('categoria-id');

        deleteCategoria(id, function (sucesso) {
            if (sucesso) {
                exibirToastCategoria('Exclusão realizada com sucesso!');
            } else {
                exibirToastCategoria('Ocorreu um erro durante a exclusão.');
            }
        })
        $('#exclusaoCategoriaModal').modal('hide');
        setTimeout(function () {
            todasAsCategorias();
        }, 500);
    });

    //Página de Eventos

    $('#formPesquisaComplexa').submit(function (event) {
        event.preventDefault();

        if (this.checkValidity() === false) {
            return;
        }

        let itemBuscado = document.getElementById('itemBuscado').value;
        let chave = document.getElementById('inputBusca').value;
        let eventos = [];

        getEventos(function (sucesso, response) {
            if (sucesso) {
                if (chave != '') {
                    response.forEach(evento => {

                        if (itemBuscado == 'id') {
                            if (evento[itemBuscado] == chave) {
                                eventos.push(evento);
                            }
                        } else {
                            let regex = new RegExp(chave, 'gmi');
                            if (evento[itemBuscado].match(regex) != null) {
                                eventos.push(evento);
                            }
                        }
                    });
                } else {
                    eventos = response;
                }
                listarEventos(eventos);
            }
        });

    });

    $('#formEvento').submit(function (event) {

        event.preventDefault();
        if (this.checkValidity() === false) return;
        const radioButtons = document.getElementsByName('radioModalidade');

        let dataInicio = document.getElementById("dtInicio").value;
        let dataFinal = document.getElementById("dtFim").value;
        let titulo = document.getElementById("titulo").value;

        if (!validaDatas(dataInicio, dataFinal)) {
            toastErroEvento('As datas devem atender aos seguintes critérios:\n\nA data inicial deve ser igual ou posterior à 01/01/2002;\nA data final deve ser igual ou anterior à 01/01/2099;\nA data inicial deve ser anterior ou igual à data final.');
            return;
        } else if (!validarCampo(titulo, 'texto')){
            toastErroEvento('O título deve conter no mínimo 5 caracteres, aceitando letras, números e hífens (-).');
            titulo.focus();
            return;
        }

        let evento = {
            titulo: titulo.toUpperCase(),
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
                exibirToastEvento('Evento de id n°' + response.id + " criado com sucesso.");
                $('#cadastroEventoModal').modal('hide');
                todosOsEventos();
            } else {
                exibirToastEvento('Ocorreu um erro ao adicionar a evento. Tente novamente mais tarde.');
            }
        });

    });

    $('#formEdicaoEvento').submit(function (event) {

        event.preventDefault();
        if (document.getElementById('formEdicaoEvento').checkValidity() === false) return;
        const radioButtons = document.getElementsByName('radioModalidadeEdicao');

        let dataInicio = document.getElementById("dtInicioEdicao").value;
        let dataFinal = document.getElementById("dtFimEdicao").value;
        let titulo = document.getElementById("tituloEdicao").value;

        if (!validaDatas(dataInicio, dataFinal)) {
            exibirToastEvento('As datas devem atender aos seguintes critérios:\n\nA data inicial deve ser igual ou posterior à 01/01/2002;\nA data final deve ser igual ou anterior à 01/01/2099;\nA data inicial deve ser anterior ou igual à data final.');
            return;
        } else if (!validarCampo(titulo, 'texto')){
            toastErroEvento('O título deve conter no mínimo 5 caracteres, aceitando letras, números e hífens (-).');
            titulo.focus();
            return;
        }

        let evento = {
            id: parseInt(document.getElementById("idEdicao").value),
            titulo: titulo.toUpperCase(),
            descricao: document.getElementById("descricaoEdicao").value,
            categoria: parseInt(document.getElementById('categoriaEdicao').value),
            usuario: document.getElementById("autorEdicao").value,
            dataInicial: converterDataFormato(dataInicio),
            dataFinal: converterDataFormato(dataFinal)
        };

        radioButtons.forEach(function (radio) {
            if (radio.checked) {
                evento.modalidade = radio.value;
            }
        });

        patchEvento((evento), function (sucesso, response) {
            if (sucesso) {
                exibirToastEvento('Evento de id n°' + response.id + " salvo com sucesso.");
                $('#edicaoEventoModal').modal('hide');
                todosOsEventos();
            } else {
                exibirToastEvento('Ocorreu um erro ao salvar o evento. Tente novamente mais tarde.');
            }
        });

    });

    $('#confirmarExclusaoEvento').click(function () {
        let btnConfirmacao = document.getElementById('confirmarExclusaoEvento');
        let id = btnConfirmacao.getAttribute('evento-id');

        deleteEvento(id, function (sucesso) {
            if (sucesso) {
                exibirToastEvento('Exclusão realizada com sucesso!');
            } else {
                exibirToastEvento('Ocorreu um erro durante a exclusão.');
            }
        })
        $('#exclusaoEventoModal').modal('hide');
        setTimeout(function () {
            todosOsEventos();
        }, 500);
    });

    $('#cadastroEventoModal').on('hidden.bs.modal', function (e) {
        $('#formEvento')[0].reset();
    });


    $('#tipoRelatorio').change(function () {
        if ($(this).val() === 'complexo') {
            $('#datasParametro').show(); // Exibe a div se o valor for igual a 2
        } else {
            $('#datasParametro').hide(); // Oculta a div se o valor for diferente de 2
        }
    });

    $('#formEmitirRelatorio').submit(function(event) {
        event.preventDefault();
        let tipoRelatorio = document.getElementById('tipoRelatorio').value;
        if(tipoRelatorio == 'simples'){
            exibirToastRelatorio('Seu relatório está sendo processado...');
            window.open('https://9368-2804-d59-9658-6400-e028-bf31-24e9-f134.ngrok-free.app/relatorio/pdf', '_blank');
        } else if(tipoRelatorio == 'complexo'){

            let dataInicial = document.getElementById('dtInicioFiltro').value;
            let dataFinal = document.getElementById('dtFimFiltro').value;
            if(!validaDatas(dataInicial, dataFinal)){
                exibirToastRelatorio('As datas devem atender aos seguintes critérios:\n\nA data inicial deve ser igual ou posterior à 01/01/2002;\nA data final deve ser igual ou anterior à 01/01/2099;\nA data inicial deve ser anterior ou igual à data final.')
                return;
            }
            dataInicial = converterDataFormato(dataInicial);
            dataFinal = converterDataFormato(dataFinal);
            let urlRelatorio = `https://9368-2804-d59-9658-6400-e028-bf31-24e9-f134.ngrok-free.app/relatorio/pdf/data?inicio=${dataInicial}&fim=${dataFinal}`;
            exibirToastRelatorio('Seu relatório está sendo processado...');
            window.open(urlRelatorio, '_blank');
        } else if(tipoRelatorio == ''){
            exibirToastRelatorio('Selecione um tipo de relatório para continuar.');
        }
    });

});
