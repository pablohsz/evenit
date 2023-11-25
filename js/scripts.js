function validaCamposCadastro() {

    let username = document.getElementById("username").value;
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    if (!username.match(/^[a-zA-Z0-9]{5,15}$/)) {
        message = "O nome de usuário deve conter de 5 a 15 caracteres, apenas letras ou números.";
        document.getElementById("username").focus();
    } else if (!nome.match(/^[a-zA-ZÀ-ú\s]{5,}$/)) {
        message = "O nome deve ter no mínimo 5 caracteres, todos sendo letras.";
        document.getElementById("nome").focus();
    } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        message = "O email inserido não é válido.";
        document.getElementById("email").focus();
    } else if (!senha.match(/^(?=.*[a-z])(?=.*[A-Z]).{8,}$/)) {
        message = "A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas e minúsculas.";
        document.getElementById("senha").focus();
    } else {
        return {valido: true};
    }
    return {valido: false,
    mensagem:message};
}

