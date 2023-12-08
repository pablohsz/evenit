function converterDataFormato(data) {
    const partesData = data.split('/');
    const dataFormatoISO = new Date(partesData[2], partesData[1] - 1, partesData[0]);
    const dataIso = dataFormatoISO.toISOString().split('T')[0];

    return dataIso;
}

function validaDatas(dataInicial, dataFinal) {

    const dataMinima = new Date('2000-01-01');
    const dataMaxima = new Date('2099-01-01');

    dataInicial = validaConversaoParaDataFormatoIso(dataInicial);
    dataFinal = validaConversaoParaDataFormatoIso(dataFinal);

    return (dataInicial >= dataMinima && dataFinal <= dataMaxima && dataInicial <= dataFinal);
}

function validaConversaoParaDataFormatoIso(data) {
    const partesData = data.split('/');
    return new Date(partesData[2], partesData[1] - 1, partesData[0]);
}

function converterData(data) {
    data = new Date(data);

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

//Página de eventos
function todosOsEventos() {
    getEventos(function (sucesso, response) {
        if (sucesso) {
            listarEventos(response);
        } else {
            exibirMensagemEvento('Ocorreu um erro na comunicação com o servidor.')
        }
    });
}

function listarEventos(eventos) {

    const listaEventos = document.getElementById('listaEventos');
    listaEventos.innerHTML = '';

    if (eventos.length > 0) {
    eventos.forEach(evento => {

        const divItem = document.createElement('div');
        divItem.classList.add('list-group-item', 'list-group-item-action');
        const divCabecalho = document.createElement('div');
        divCabecalho.classList.add('d-flex', 'w-100', 'justify-content-between');

        const header = document.createElement('h5');
        header.classList.add('mb-1');
        header.textContent = `${evento.id} - ${evento.titulo.toUpperCase()}`;

        const small = document.createElement('small');
        small.classList.add('text-body-secondary');
        small.textContent = `${evento.categoria.categoria.toUpperCase()}`;

        divCabecalho.appendChild(header);
        divCabecalho.appendChild(small);

        const smallSecundaria = document.createElement('small');
        smallSecundaria.classList.add('text-body-secondary');
        smallSecundaria.textContent = `${converterData(evento.dataInicial)} - ${converterData(evento.dataFinal)}`;

        const divDescricao = document.createElement('div');
        divDescricao.classList.add('d-flex', 'justify-content-between', 'align-items-start');

        const descricao = document.createElement('p');
        descricao.classList.add('mb-1');
        descricao.textContent = evento.descricao;

        divDescricao.appendChild(descricao);

        if (ehAdministrador()) {
            const grupoBtn = document.createElement('div');
            grupoBtn.classList.add('btn-group');
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-primary', 'btn-sm');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = function () {
                editarEvento(evento);
            };
            const btnExcluir = document.createElement('button');
            btnExcluir.classList.add('btn', 'btn-danger', 'btn-sm');
            btnExcluir.textContent = 'Excluir';
            btnExcluir.onclick = function () {
                deletarEvento(evento.id);
            };

            grupoBtn.appendChild(btnEditar);
            grupoBtn.appendChild(btnExcluir);
            divDescricao.appendChild(grupoBtn);
        }

        divItem.appendChild(divCabecalho);
        divItem.appendChild(smallSecundaria);
        divItem.appendChild(divDescricao);

        listaEventos.appendChild(divItem);

    });
    } else {
        exibirMensagemEvento('Nenhum item a ser exibido.');
    }
}

function deletarEvento(id) {
    let btnConfirmacao = document.getElementById('confirmarExclusaoEvento');
    btnConfirmacao.setAttribute('evento-id', id);

    let bodyModal = document.getElementById('exclusaoEventoModal').getElementsByClassName('modal-body')[0];

    bodyModal.innerHTML = '<p>Deseja realmente excluir o evento de id n°' + id + '?</p>';
    $('#exclusaoEventoModal').modal('show');
}

function editarEvento(evento) {

    let inputId = document.getElementById('idEdicao');
    let modalidadeRadio = document.getElementsByName('radioModalidadeEdicao');
    let inputTitulo = document.getElementById('tituloEdicao');
    let inputDescricao = document.getElementById('descricaoEdicao');
    let inputCategoria = document.getElementById('categoriaEdicao');
    let inputDataInicial = document.getElementById('dtInicioEdicao');
    let inputDataFinal = document.getElementById('dtFimEdicao');

    inputId.value = evento.id;
    inputTitulo.value = evento.titulo.toUpperCase();
    inputCategoria.value = evento.categoria.id;
    inputDescricao.value = evento.descricao;
    inputDataInicial.value = `${converterData(evento.dataInicial)}`;
    inputDataFinal.value = `${converterData(evento.dataFinal)}`;

    modalidadeRadio.forEach(function (radio) {
        if (radio.value.toLowerCase() == evento.modalidade) {
            radio.checked = true;
        }
    });

    $('#edicaoEventoModal').modal('show');
}

function exibirToastEvento(mensagem) {
    const toast = document.getElementById('toastEvento');
    const toastBody = document.querySelector('.toast-body');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);

    toastBody.textContent = mensagem;
    toastBootstrap.show()
}

function exibirMensagemEvento(mensagem) {
    let lista = document.getElementById('listaEventos');
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    let paragrafoMensagem = document.createElement('p');
    paragrafoMensagem.classList.add('text-center', 'lead');
    paragrafoMensagem.textContent = mensagem;
    lista.appendChild(paragrafoMensagem);
}

//Página de categorias

function todasAsCategorias() {
    getCategorias(function (sucesso, response) {
        if (sucesso) {
            listarCategorias(response);

        } else exibirMensagemCategoria('Ocorreu um erro na conexão com o servidor.');
    });
}

function listarCategorias(categorias) {
    const corpoTabela = document.getElementById('corpoTabelaCategorias');
    corpoTabela.innerHTML = '';

    if (categorias.length > 0) {
        categorias.forEach(categoria => {
            const tr = document.createElement('tr');
            const trId = document.createElement('th');
            trId.textContent = categoria.id;
            const tdNome = document.createElement('td');
            tdNome.textContent = categoria.categoria.toUpperCase();
            const tdDescricao = document.createElement('td');
            tdDescricao.textContent = categoria.descricao;
            const tdOpcoes = document.createElement('td');

            if (ehAdministrador()) {
                const grupoBtn = document.createElement('div');
                grupoBtn.classList.add('btn-group');
                const btnEditar = document.createElement('button');
                btnEditar.classList.add('btn', 'btn-primary', 'btn-sm');
                btnEditar.textContent = 'Editar';
                btnEditar.onclick = function () {
                    editarCategoria(categoria)
                };
                const btnExcluir = document.createElement('button');
                btnExcluir.classList.add('btn', 'btn-danger', 'btn-sm');
                btnExcluir.textContent = 'Excluir';
                btnExcluir.onclick = function () {
                    deletarCategoria(categoria.id)
                };

                grupoBtn.appendChild(btnEditar);
                grupoBtn.appendChild(btnExcluir);
                tdOpcoes.appendChild(grupoBtn);
            }

            tr.appendChild(trId);
            tr.appendChild(tdNome);
            tr.appendChild(tdDescricao);
            tr.appendChild(tdOpcoes);

            corpoTabela.appendChild(tr);

        });
    } else {
        exibirMensagemCategoria('Nenhum item a ser exibido.');
    }

}

function deletarCategoria(id) {
    let btnConfirmacao = document.getElementById('confirmarExclusaoCategoria');
    btnConfirmacao.setAttribute('categoria-id', id);

    let bodyModal = document.getElementById('exclusaoCategoriaModal').getElementsByClassName('modal-body')[0];
    bodyModal.innerHTML = '<p>Deseja realmente excluir a categoria de id n°' + id + '?</p>';
    $('#exclusaoCategoriaModal').modal('show');
}

function editarCategoria(categoria) {

    let inputId = document.getElementById('idEdicao');
    let inputCategoria = document.getElementById('categoriaEdicao');
    let inputDescricao = document.getElementById('descricaoEdicao');

    inputId.value = categoria.id;
    inputCategoria.value = categoria.categoria.toUpperCase();
    inputDescricao.value = categoria.descricao;

    $('#edicaoCategoriaModal').modal('show');
}

function exibirMensagemCategoria(mensagem) {
    let tabela = document.getElementById('tabelaCategoria');
    tabela.style.display = 'none';
    let conteudo = document.getElementById('conteudoCategorias');
    let paragrafoExistente = conteudo.querySelector('p');
    if (paragrafoExistente) {
        conteudo.removeChild(paragrafoExistente);
    }
    let paragrafoMensagem = document.createElement('p');
    paragrafoMensagem.classList.add('text-center', 'lead');
    paragrafoMensagem.textContent = mensagem;
    conteudo.appendChild(paragrafoMensagem);
}

function exibirToastCategoria(mensagem) {
    const toast = document.getElementById('toastCategoria');
    const toastBody = document.querySelector('.toast-body');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);

    toastBody.textContent = mensagem;
    toastBootstrap.show()
}

function ehAdministrador() {
    const dadosUsuario = JSON.parse(localStorage.getItem('usuario'));
    return dadosUsuario.admin;
}

//Página de relatórios
function exibirToastRelatorio(mensagem) {
    const toast = document.getElementById('toastRelatorio');
    const toastBody = document.querySelector('.toast-body');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);

    toastBody.textContent = mensagem;
    toastBootstrap.show()
}


function validarCampo(entrada, tipo) {

    switch (tipo) {
        case 'texto':
            const textoRegex = /^(?=.*[a-zA-Z0-9-À-ÿ\u00C7\u00E7])[a-zA-Z0-9À-ÿ\u00C7\u00E7 -]+$/gmi;
            return textoRegex.test(entrada);
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(entrada);
        case 'numero':
            const numeroRegex = /^\d+$/;
            return numeroRegex.test(entrada);
        default:
            return true;
    }
}

function toastErroEvento(mensagem){
    const toast = document.getElementById('toastEventoErro');
    const toastBody = document.getElementById('toastErroMensagem');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);

    toastBody.textContent = mensagem;
    toastBootstrap.show();
}

function toastErroCategoria(mensagem){
    const toast = document.getElementById('toastCategoriaErro');
    const toastBody = document.getElementById('toastErroMensagem');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);

    toastBody.textContent = mensagem;
    toastBootstrap.show();
}
