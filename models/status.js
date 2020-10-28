class Permit {
    constructor() {
        this.statusList = [{
                status: 200,
                status_text: "good boy"
            },
            {
                status: 210,
                status_text: "version updated"
            },
            {
                status: 300,
                status_text: "new user"
            },
            {
                status: 310,
                status_text: "install new version"
            },
            {
                status: 400,
                status_text: "access denide"
            }
        ];
    }

    status(value) {
        const found = this.statusList.find(statusList => statusList.status === value);
        return found;
    }
}


module.exports = {
    permit: new Permit()
}