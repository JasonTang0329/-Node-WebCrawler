let crypto = require('crypto');

let helper = {};

helper.padLeft = (str, lenght) => {

    str = str.toString();

    if (str.length >= lenght)
        return str;
    else
        return helper.padLeft('0' + str, lenght);
};

helper.getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

helper.getSignature = (clientID, secretKey, timestamp, reqData) => {

    const signData = Object.assign(reqData, {
        ClientID: clientID,
        SecretKey: secretKey,
        Timestamp: timestamp,
    });

    const keys = Object.keys(signData).sort();
    const data = {};

    for (let i in keys)
        data[keys[i]] = reqData[keys[i]];

    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
}

helper.removeArrayUndefined = (arr) => {

    return arr.filter(arr => arr != undefined);
}

module.exports = helper;