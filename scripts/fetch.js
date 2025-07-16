class Fetch {
    static PROTOCAL_HOST_PORT = "https://study.duyiedu.com:443";
    static token = localStorage.getItem("token");

    response = {
        headers: undefined,
        body: undefined,
    };

    constructor(path) {
        this.path = path;
    }

    async getResponseData(method = "GET", headers = {}, body = null) {
        this.response.headers = await fetch(
            Fetch.PROTOCAL_HOST_PORT + this.path,
            {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
                body: body ? JSON.stringify(body) : null,
            }
        );
        this.response.body = await this.response.headers.json();

        return this.response;
    }

    /**
     * 使用GET方式请求发送消息，返回响应的消息的对象
     * @param {Object} headers
     * @returns {Object}
     */
    async get(headers = {}) {
        return await this.getResponseData("GET", headers);
    }

    /**
     * 使用POST请求发送消息，返回响应的消息的对象
     * @param {Object} headers 请求头
     * @param {Object} body 请求体
     */
    async post(headers = {}, body = null) {
        return await this.getResponseData("POST", headers, body);
    }
}
