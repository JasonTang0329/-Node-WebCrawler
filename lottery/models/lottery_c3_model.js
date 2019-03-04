let database = require('../config/database');

let table = database.sequelize.define('lottery_c3', {
    no: {
        type: database.STRING,
        primaryKey: true,
    },
    number: database.STRING,
    datetime: database.STRING,
}, database.options());

module.exports = table;