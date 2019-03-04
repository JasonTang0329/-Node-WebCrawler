let config = require('./config');
let Sequelize = require('sequelize');
let database = Sequelize;

database.sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: false,
    timezone: '+08:00',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

database.options = function() {
    return {
        freezeTableName: true,
        timestamps: false
    };
};

module.exports = database;