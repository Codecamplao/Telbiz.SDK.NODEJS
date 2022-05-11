# telbiz


Using npm:

```bash
$ npm install telbiz
```

```js
const Telbiz = require("telbiz")

// Must provide ClientID and  Secret
const tb = new Telbiz("XXXXX253832870000", "b266ef94-bb18-4ff2-8f38-e358f130XXXX")

tb.SendSMSAsync(tb.SMSHeader.Default, "209961XXXX", "Hi ... 1").then((rs) => {
    console.log(rs)
}).catch((err) => {
    console.log("Error: ", err)
})

tb.SendTopupAsync("205504XXXX", 10000).then((rs) => {
    console.log(rs)
}).catch((err) => {
    console.log("Error: ", err)
})

```

> **NOTE:** Phone number must be start with 20 or 30 , Topup function SendTopupAsync Amount be at least 5000