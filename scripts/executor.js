class Executor {
    instance = undefined;
    static verification = new Fetch("/api/user/exists?loginId=");
    static currentUserInfo = new Fetch("/api/user/profile");
    static chatRecord = new Fetch("/api/chat/history");

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

    static verificationAccount(loginId) {
        Executor.verification.path += loginId;
        return Executor.verification.get();
    }

    static getCurrentLoginUserInfo() {
        return Executor.currentUserInfo.get({
            authorization: Fetch.token ? `Bearer ${Fetch.token}` : null,
        });
    }

    static getChatRecord() {
        return Executor.chatRecord.get({
            authorization: Fetch.token ? `Bearer ${Fetch.token}` : null,
        });
    }
}
