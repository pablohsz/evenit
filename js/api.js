function postCredenciais(credenciais, callback) {
    $.ajax({
        url: 'http://localhost:9095/usuario/login',
        method: 'POST',
        data: JSON.stringify(credenciais),
        contentType: 'application/json',
        success: function (response) {
            callback(true)
        },
        error: function (error) {
            callback(false)
        }
    });
}

function getVerificaUsuario(username, callback) {
    $.ajax({
        url: 'http://localhost:9095/usuario/' + username,
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
        url: 'http://localhost:9095/usuario',
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