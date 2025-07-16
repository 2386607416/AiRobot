class Register extends Login {
    request = new Fetch("/api/user/reg");

    constructor(data) {
        super(data);
    }

    initialization() {
        this.registerForm = document.getElementById("register");
        this.loginForm = document.getElementById("login");
        this.accountInputElement = document.querySelector(
            "#register input.account"
        );
        this.nicknameInputElement = document.querySelector(
            "#register input.nickname"
        );
        this.passwordInputElement = document.querySelector(
            "#register input.password"
        );
        this.confirmPasswordInputElement = document.querySelector(
            "#register input.confirm-password"
        );
        this.buttonELement = document.querySelector("#register button.button");
        this.accountErrorElement = document.querySelector(
            ".register .account-error"
        );
        this.nicknameErrorElement = document.querySelector(
            ".register .nickname-error"
        );
        this.passwordErrorElement = document.querySelector(
            ".register .password-error"
        );
        this.confirmPasswordErrorElement = document.querySelector(
            ".register .confirm-password-error"
        );

        this.createBinding();
        this.bindEvent();
    }

    showNicknameError(reson) {
        return this.showError(this.nicknameErrorElement, reson);
    }

    showConfirmPasswordError(reson) {
        return this.showError(this.confirmPasswordErrorElement, reson);
    }

    bindingInputData(inputElement, errorElement, propertyKey) {
        if (propertyKey !== "confirmPassword") {
            super.bindingInputData(inputElement, errorElement, propertyKey);
        } else {
            if (inputElement) {
                inputElement.addEventListener("input", (event) => {
                    const value = event.target.value;

                    if (value === "") {
                        this.showConfirmPasswordError("确认密码不能为空");
                    } else if (this.data.password !== value) {
                        this.showConfirmPasswordError("两次输入的密码不一致");
                    } else {
                        this.hiddenError(this.confirmPasswordErrorElement);
                    }

                    this.data[propertyKey] = value;
                });
            }
        }
    }

    createBinding() {
        this.bindingInputData(
            this.accountInputElement,
            this.accountErrorElement,
            "account"
        );
        this.bindingInputData(
            this.nicknameInputElement,
            this.nicknameErrorElement,
            "nickname"
        );
        this.bindingInputData(
            this.passwordInputElement,
            this.passwordErrorElement,
            "password"
        );
        this.bindingInputData(
            this.confirmPasswordInputElement,
            this.confirmPasswordErrorElement,
            "confirmPassword"
        );
    }

    bindEvent() {
        this.buttonELement.addEventListener("click", async () => {
            const result = this.judgeDataIsEmpty();

            if (result === "account") {
                this.showAccountError("账号不能为空");

                return undefined;
            } else if (result === "nickname") {
                this.showNicknameError("昵称不能为空");

                return undefined;
            } else if (result === "password") {
                this.showPasswordError("密码不能为空");

                return undefined;
            } else if (result === "confirmPassword") {
                this.showConfirmPasswordError("确认密码不能为空");

                return undefined;
            } else {
                const { body: data } = await this.request.post(undefined, {
                    loginId: this.data.account,
                    nickname: this.data.nickname,
                    loginPwd: this.data.password,
                });

                if (data.code === 400) {
                    this.showAccountError(data.msg);
                } else if (data.code === 0) {
                    this.hiddenError(this.accountErrorElement);
                    this.registerForm.reset();
                    this.registerForm.classList.remove("isShow");
                    this.loginForm.classList.add("isShow");
                }
            }
        });
    }
}
