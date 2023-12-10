const baseUrl = 'https://dc4f-2804-d59-9658-6400-cd86-152f-d7a5-1215.ngrok-free.app';

function postCredenciais(credenciais, callback) {
    $.ajax({
        url: baseUrl + '/usuario/login',
        method: 'POST',
        data: JSON.stringify(credenciais),
        contentType: 'application/json',
        success: function (response) {
            callback(true, response)
        },
        error: function (error) {
            callback(false, error)
        }
    });
}

function getVerificaUsuario(username, callback) {
    $.ajax({
        url: baseUrl + '/usuario/' + username,
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'skip'
        },
        success: function (response) {
            callback(true)
        },
        error: function (error) {
            callback(false)
        }
    });
}

function postNovoUsuario(usuario, callback) {
    $.ajax({
        url: baseUrl + '/usuario',
        method: 'POST',
        data: JSON.stringify(usuario),
        contentType: 'application/json',
        success: function (response) {
            callback(true)
        },
        error: function (error) {
            callback(false)
        }
    });
}

function postNovaCategoria(categoria, callback) {
    $.ajax({
        url: baseUrl + '/categorias',
        method: 'POST',
        data: JSON.stringify(categoria),
        contentType: 'application/json',
        success: function (response) {
            callback(true, response);
        },
        error: function (error) {
            callback(false, error);
        }
    });
}

function getCategorias(callback) {
    $.ajax({
        url: baseUrl + '/categorias',
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'skip'
        },
        success: function (response) {
            callback(true, response);
        },
        error: function (error) {
            callback(false, error);
        }
    });
}

function patchCategoria(categoria, callback) {
    $.ajax({
        url: baseUrl + '/categorias',
        method: 'PATCH',
        data: JSON.stringify(categoria),
        contentType: 'application/json',
        success: function (response) {
            callback(true, response);
        },
        error: function (error) {
            callback(false, error);
        }
    });
}

function deleteCategoria(id, callback) {
    $.ajax({
        url: baseUrl + '/categorias/' + parseInt(id),
        method: 'DELETE',
        success: function (response) {
            callback(true);
        },
        error: function (error) {
            callback(false);
        }
    });
}

function getEventos(callback) {
    $.ajax({
        url: baseUrl + '/eventos',
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'skip'
        },
        success: function (response) {
            callback(true, response);
        },
        error: function (error) {
            callback(false, error);
        }
    });
}

function getEventosPorData(dtInicial, dtFinal, callback) {
    $.ajax({
        url: baseUrl + `/eventos/data?inicio=${dtInicial}&fim=${dtFinal}`,
        method: 'GET',
        headers: {
            'ngrok-skip-browser-warning': 'skip'
        },
        success: function (response) {
            callback(true, response);
        },
        error: function (error) {
            callback(false, error);
        }
    });
}

function postNovoEvento(evento, callback) {
    $.ajax({
        url: baseUrl + '/eventos',
        method: 'POST',
        data: JSON.stringify(evento),
        contentType: 'application/json',
        success: function (response) {
            callback(true, response);
        },
        error: function (error) {
            callback(false, error);
        }
    });
}

function patchEvento(evento, callback) {
    $.ajax({
        url: baseUrl + '/eventos',
        method: 'PATCH',
        data: JSON.stringify(evento),
        contentType: 'application/json',
        success: function (response) {
            callback(true, response);
        },
        error: function (error) {
            callback(false, error);
        }
    });
}

function deleteEvento(id, callback) {
    $.ajax({
        url: baseUrl + '/eventos/' + parseInt(id),
        method: 'DELETE',
        success: function (response) {
            callback(true);
        },
        error: function (error) {
            callback(false);
        }
    });
}
