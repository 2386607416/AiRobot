class Executor {
    instance = undefined;
    verification = new Fetch("/api/user/exists?loginId=");
    currentUserInfo = new Fetch("/api/user/profile");
    chatRecord = new Fetch("/api/chat/history");

    constructor(loginData, registerData) {
        this.login = new Login(loginData);
        this.register = new Register(registerData);
    }

    static getInstance(loginData, registerData) {
        if (this.instance) {
            return this.instance;
        }

        this.instance = new Executor(loginData, registerData);

        return this.instance;
    }

    verificationAccount(loginId) {
        this.verification.path += loginId;
        return this.verification.get();
    }

    getCurrentLoginUserInfo() {
        return this.currentUserInfo.get({
            authorization: Fetch.token ? `Bearer ${Fetch.token}` : null,
        });
    }

    getChatRecord() {
        return this.chatRecord.get({
            authorization: Fetch.token ? `Bearer ${Fetch.token}` : null,
        });
    }
}
