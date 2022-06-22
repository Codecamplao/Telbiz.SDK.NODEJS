const axios = require("axios");
const https = require('https');

const UrlEndpoint = "https://api.telbiz.la";
const TokenUrl = "/api/v1/connect/token";
const SMSUrl = "/api/v1/smsservice/newtransaction";
const Topup = "/api/v1/topupservice/newtransaction";

const GrantType = "client_credentials";
const Scope = "Telbiz_API_SCOPE profile openid";

class Telbiz {
    #ClientID
    #Secret
    SMSHeader = {
        "Default": "Telbiz",
        "News": "News",
        "Promotion": "Promotion",
        "OTP": "OTP",
        "Info": "Info"
    }

    constructor(ClientID, Secret) {
        this.#ClientID = ClientID;
        this.#Secret = Secret;
    }

    // Get access token
    async GetAccessToken() {
        return new Promise(async (resolve, reject) => {
            await axios({
                    url: UrlEndpoint + TokenUrl,
                    method: "POST",
                    data: {
                        ClientID: this.#ClientID,
                        GrantType: GrantType,
                        Scope: Scope,
                        Secret: this.#Secret
                    },

                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        // Overwrite Axios's automatically set Content-Type
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    resolve(response.data.accessToken);
                })
                .catch((err) => {
                    // console.log(err); // Error handler
                    reject(err.response);
                });
        })
    }

    // Send sms
    async SendSMSAsync(header, phone, message) {
        var token = await this.GetAccessToken()
        return new Promise(async (resolve, reject) => {
            if (typeof Number(phone) !== 'number') {
                reject({
                    statusText: 'INVALID_PHONE_NUMBER',
                    message: "Phone number must be number only."
                })
            }
            if (phone.substring(0, 2) !== "20" && phone.substring(0, 2) !== "30") {
                reject({
                    statusText: 'INVALID_PHONE_NUMBER',
                    message: "Start with 20xxxxxxxx or 30xxxxxxx"
                })
            }

            if (phone.length > 10) {
                reject({
                    statusText: 'INVALID_LENGTH_PHONE_NUMBER'
                })
            }

            await axios({
                    url: UrlEndpoint + SMSUrl,
                    method: "POST",
                    data: {
                        Title: header,
                        Message: message,
                        Phone: phone
                    },

                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        // Overwrite Axios's automatically set Content-Type
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + token
                    }
                })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    // console.log(err); // Error handler

                    if (err.response.status === 401 || err.response.status === 419) {
                        reject({
                            status: 401,
                            statusText: 'Unauthorized'
                        })
                        return;
                    }
                    reject(err.response.data);
                });
        })
    }

    // Send sms
    async SendTopupAsync(phone, amount) {

        var token = await this.GetAccessToken()
        return new Promise(async (resolve, reject) => {
            if (typeof Number(phone) !== 'number') {
                reject({
                    statusText: 'INVALID_PHONE_NUMBER',
                    message: "Phone number must be number only."
                })
            }
            if (phone.substring(0, 2) !== "20" && phone.substring(0, 2) !== "30") {
                reject({
                    statusText: 'INVALID_PHONE_NUMBER',
                    message: "Start with 20xxxxxxxx or 30xxxxxxx"
                })
            }

            if (phone.length > 10) {
                reject({
                    statusText: 'INVALID_LENGTH_PHONE_NUMBER'
                })
            }

            if (amount < 5000) {
                reject({
                    statusText: 'INVALID_AMOUNT',
                    message: "Amount be at least 5000"
                })
            }

            await axios({
                    url: UrlEndpoint + Topup,
                    method: "POST",
                    data: {
                        Amount: amount,
                        Phone: phone
                    },

                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        // Overwrite Axios's automatically set Content-Type
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + token
                    }
                })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((err) => {
                    // console.log(err); // Error handler
                    if (err.response.status === 401 || err.response.status === 419) {
                        reject({
                            status: 401,
                            statusText: 'Unauthorized'
                        })
                        return;
                    }
                    reject(err.response.data);
                });
        })
    }

}

module.exports = Telbiz;
