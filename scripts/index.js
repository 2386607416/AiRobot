let loginData = {
    account: undefined,
    password: undefined,
};
let registerData = {
    account: undefined,
    nickname: undefined,
    password: undefined,
    confirmPassword: undefined,
};

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login");
    const registerForm = document.getElementById("register");
    const loginLink = document.querySelector(".go-to-login");
    const registerLink = document.querySelector(".go-to-register");

    registerLink.addEventListener("click", function (event) {
        loginForm.classList.toggle("isShow");
        registerForm.classList.toggle("isShow");
    });

    loginLink.addEventListener("click", function (event) {
        registerForm.classList.toggle("isShow");
        loginForm.classList.toggle("isShow");
    });

    Executor.getInstance(loginData, registerData);
});
