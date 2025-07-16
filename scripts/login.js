class Login extends From {
    request = new Fetch("/api/user/login");

    constructor(data) {
        super(data);
    }

    initialization() {
        this.accountInputElement = document.querySelector(
            "#login input.account"
        );
        this.passwordInputElement = document.querySelector(
            "#login input.password"
        );
        this.buttonELement = document.querySelector("#login button.button");
        this.accountErrorElement = document.querySelector(
            ".login .account-error"
        );
        this.passwordErrorElement = document.querySelector(
            ".login .password-error"
        );

        this.createBinding();
        this.bindEvent();
    }

    showAccountError(reson) {
        return this.showError(this.accountErrorElement, reson);
    }

    showPasswordError(reson) {
        return this.showError(this.passwordErrorElement, reson);
    }

    /**
     * 创建输入框和数据的绑定。
     * 该方法会将输入框的值绑定到数据对象的对应属性上
     */
    createBinding() {
        this.bindingInputData(
            this.accountInputElement,
            this.accountErrorElement,
            "account"
        );
        this.bindingInputData(
            this.passwordInputElement,
            this.passwordErrorElement,
            "password"
        );
    }

    bindEvent() {
        this.buttonELement.addEventListener("click", async () => {
            const result = this.judgeDataIsEmpty();

            if (result === "account") {
                this.showAccountError("账号不能为空");

                return undefined;
            } else if (result === "password") {
                this.showPasswordError("密码不能为空");

                return undefined;
            } else {
                const { headers, body: data } = await this.request.post(
                    undefined,
                    {
                        loginId: this.data.account,
                        loginPwd: this.data.password,
                    }
                );

                if (data.code === 400) {
                    this.showPasswordError(data.msg);
                } else if (data.code === 0) {
                    Fetch.token = headers.headers.get("authorization");

                    /**
                     * 将令牌存储到本地
                     */
                    localStorage.setItem("token", Fetch.token);

                    this.hiddenError(this.passwordErrorElement);
                }
            }
        });
    }
}
