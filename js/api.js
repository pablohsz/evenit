const baseUrl = 'http://localhost:9095';

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