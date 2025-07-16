class From {
    constructor(data) {
        this.data = this.proxyData(data);
        this.initialization();
    }

    /**
     * 初始化方法。
     * 该方法通常用于初始化输入框和错误提示元素。
     */
    initialization() {}

    judgeDataIsEmpty() {
        for (const key in this.data) {
            if (!this.data[key]) {
                return key;
            }
        }

        return undefined;
    }

    /**
     * 在页面上显示错误信息。
     * @param {HTMLElement} element
     * @param {any} reson
     * @returns
     */
    showError(element, reson) {
        if (element) {
            element.innerText = reson;
            element.style.visibility = "visible";

            return true;
        }

        return false;
    }

    /**
     * 在页面上隐藏错误信息。
     * @param {HTMLElement} element
     * @returns {Boolean}
     */
    hiddenError(element) {
        if (element) {
            element.style.visibility = "hidden";

            return true;
        }

        return false;
    }

    request(url, method = "GET", headers = {}, body = null) {
        return (async function () {
            const responseHeaders = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    ...JSON.stringify(headers),
                },
                body: body ? JSON.stringify(body) : null,
            });
            const responseBody = await responseHeaders.json();

            return {
                headers: responseHeaders,
                body: responseBody,
            };
        })();
    }

    /**
     * 创建一个代理对象，用于绑定输入数据到目标对象。
     * 该代理对象会拦截对目标对象属性的访问和修改。
     * @param {Object} target
     * @returns {Proxy}
     */
    proxyData(target) {
        const proxy = new Proxy(target, {
            set: function (target, propertyKey, value) {
                if (Reflect.has(target, propertyKey)) {
                    return Reflect.set(target, propertyKey, value);
                } else {
                    throw new TypeError(
                        `Property ${propertyKey} does not exist on target object`
                    );
                }
            },
            get: function (target, propertyKey) {
                if (Reflect.has(target, propertyKey)) {
                    return Reflect.get(target, propertyKey);
                } else {
                    throw new TypeError(
                        `Property ${propertyKey} does not exist on target object`
                    );
                }
            },
        });

        return proxy;
    }

    /**
     * 绑定数据到输入元素。
     * 当输入元素的值发生变化时，更新目标对象的对应属性。
     * @param {HTMLInputElement} inputElement
     * @param {String} propertyKey
     * @returns
     */
    bindingInputData(inputElement, errorElement, propertyKey) {
        const keys = {
            account: "账号",
            nickname: "昵称",
            password: "密码",
            confirmPassword: "确认密码",
        };

        if (inputElement) {
            inputElement.addEventListener("input", (event) => {
                const value = event.target.value;

                if (value === "") {
                    this.showError(
                        errorElement,
                        `${keys[propertyKey]}不能为空`
                    );
                } else {
                    this.hiddenError(errorElement);
                }

                this.data[propertyKey] = value;
            });
        }

        return undefined;
    }

    /**
     * 让派生类实现该方法。
     * 该方法用于创建输入框和数据的绑定。
     * 该方法通常会在初始化时调用。
     */
    createBinding() {}

    /**
     * 让派生类实现该方法。
     * 该方法用于绑定事件。
     */
    bindEvent() {}
}
