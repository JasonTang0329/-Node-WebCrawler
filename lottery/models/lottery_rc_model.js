let database = require('../config/database');

let table = database.sequelize.define('lottery_rc', {
    no: {
        type: database.STRING,
        primaryKey: true,
    },
    number: database.STRING,
    datetime: database.STRING,
}, database.options());

module.exports = table;