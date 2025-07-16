class Chat {
    static AI = "ai";
    static USER = "user";

    request = new Fetch("/api/chat");

    constructor() {
        this.initialization();
    }

    initialization() {
        this.chatContainerElement =
            document.getElementsByClassName("chat-container")[0];
        this.inputChatElement = document.getElementById("txtMsg");
        this.formElement = document.getElementsByTagName("form")[0];
        this.closeButtonElement = document.getElementsByClassName("close")[0];

        this.bindingEvent();
        this.showHistoryChatRecord();
    }

    /**
     * 创建元素
     * @param {String} tagName
     * @returns {HTMLElement}
     */
    createElement(tagName) {
        const element = document.createElement(tagName);

        return element;
    }

    /**
     * 创建在页面上显示的聊天记录元素
     * @param {String} type 判断是用户还是AI
     * @param {String} message 用户发送的消息或AI发送的消息
     * @param {String} date 发送消息的时间
     */
    createChatElement(type, message, date) {
        const chatShellElement = this.createElement("div");
        const imgElement = this.createElement("img");
        const messageElement = this.createElement("p");
        const dateElement = this.createElement("small");

        chatShellElement.classList.add(
            "chat-item",
            type === Chat.USER ? "me" : null
        );
        imgElement.classList.add("chat-avatar");
        messageElement.classList.add("chat-content");
        dateElement.classList.add("chat-date");

        imgElement.src =
            type === Chat.USER ? "./asset/avatar.png" : "./asset/robot.png";
        messageElement.innerText = message;
        dateElement.innerText = date;

        chatShellElement.appendChild(imgElement);
        chatShellElement.appendChild(messageElement);
        chatShellElement.appendChild(dateElement);

        return chatShellElement;
    }

    /**
     * 将时间戳格式化为标准时间
     * @param {Date} timestamp 时间戳
     * @returns {String} 格式化的时间
     */
    getCurrentDate(timestamp = Date.now()) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hour = date.getHours().toString().padStart(2, "0");
        const minute = date.getMinutes().toString().padStart(2, "0");
        const second = date.getSeconds().toString().padStart(2, "0");

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    /**
     * 将用户的历史聊天记录显示到页面上
     */
    async showHistoryChatRecord() {
        const {
            body: { code, data },
        } = await Executor.getChatRecord();

        if (code) {
            return undefined;
        }

        for (const { content, createdAt, from } of data) {
            if (from) {
                this.chatContainerElement.appendChild(
                    this.createChatElement(
                        Chat.USER,
                        content,
                        this.getCurrentDate(createdAt)
                    )
                );
            } else {
                this.chatContainerElement.appendChild(
                    this.createChatElement(
                        Chat.AI,
                        content,
                        this.getCurrentDate(createdAt)
                    )
                );
            }
        }

        this.scrollBottom();
    }

    /**
     * 将滚动条滚动到底部
     */
    scrollBottom() {
        this.chatContainerElement.scroll({
            top: this.chatContainerElement.scrollHeight,
            left: 0,
            behavior: "smooth",
        });
    }

    /**
     * 提交表单
     */
    bindingEvent() {
        this.formElement.addEventListener("submit", async (e) => {
            e.preventDefault();

            const message = this.inputChatElement.value;

            if (message) {
                this.chatContainerElement.appendChild(
                    this.createChatElement(
                        Chat.USER,
                        message,
                        this.getCurrentDate()
                    )
                );

                this.inputChatElement.value = "";
                this.scrollBottom();

                // 将用户的消息使用POST方法发送请求，并得到响应结果
                const { body: responseBody } = await this.request.post(
                    {
                        authorization: Fetch.token
                            ? `Bearer ${Fetch.token}`
                            : null,
                    },
                    {
                        content: message,
                    }
                );
                const { code, msg, data } = responseBody;

                if (code) {
                    this.chatContainerElement.appendChild(
                        this.createChatElement(Chat.AI, msg)
                    );
                } else {
                    this.chatContainerElement.appendChild(
                        this.createChatElement(
                            Chat.AI,
                            data.content,
                            this.getCurrentDate(data.createdAt)
                        )
                    );
                }

                this.scrollBottom();
            }
        });

        this.closeButtonElement.addEventListener("click", () => {
            localStorage.removeItem("token");
            location.reload();
        });
    }
}
