let database = require('../config/database');
let lotteryC1Model = require('../models/lottery_c1_model');
let lotteryC2Model = require('../models/lottery_c2_model');
let lotteryC3Model = require('../models/lottery_c3_model');
let lotteryCtModel = require('../models/lottery_ct_model');
let lotteryRcModel = require('../models/lottery_rc_model');
let lotteryPeModel = require('../models/lottery_pe_model');
let lotteryPkModel = require('../models/lottery_pk_model');
let lotterySyModel = require('../models/lottery_sy_model');
let lotteryWnModel = require('../models/lottery_wn_model');

let helper = {};

helper.getDate = (game, callback) => {

    database.sequelize
        .query('CALL get_date(:game)', {
            replacements: {
                game: game,
            }
        })
        .then(result => callback && callback(result));
}

helper.getPeriod = (game, date, callback) => {

    database.sequelize
        .query('CALL get_period(:game, :date)', {
            replacements: {
                game: game,
                date: date,
            }
        })
        .then(result => callback && callback(result));
}

helper.getNewestPeriod = (game, period, callback) => {

    database.sequelize
        .query('CALL get_newest_period(:game,:period)', {
            replacements: {
                game: game,
                period: period,
            }
        })
        .then(result => callback && callback(result));
}

helper.getLosePeriod = (game, date, maxperiod, callback) => {
    //SQL return 缺少的期數(用,分隔)
    database.sequelize
        .query('call get_lose_period(:game,:date,:maxperiod)', {
            replacements: {
                game: game,
                date: date.replace(/\//g, '').replace(/\-/g, '').replace(/\./g, ''), //將日期處理成全數字
                maxperiod: maxperiod,
            }
        })
        .then(result => callback && callback(result));
}

helper.getPeNoByPeriod = (period, callback) => {

    database.sequelize
        .query('CALL get_lottery_pe_no_by_period(:period)', {
            replacements: {
                period: period,
            }
        })
        .then(result => callback && callback(result));
}

helper.getPePeriodByNo = (no, callback) => {

    database.sequelize
        .query('CALL get_lottery_pe_period_by_no(:no)', {
            replacements: {
                no: no,
            }
        })
        .then(result => callback && callback(result));
}

helper.getPkNoByPeriod = (period, callback) => {

    database.sequelize
        .query('CALL get_lottery_pk_no_by_period(:period)', {
            replacements: {
                period: period,
            }
        })
        .then(result => callback && callback(result));
}

helper.getPkPeriodByNo = (no, callback) => {

    database.sequelize
        .query('CALL get_lottery_pk_period_by_no(:no)', {
            replacements: {
                no: no,
            }
        })
        .then(result => callback && callback(result));
}

helper.getLoseDate = (game, callback) => {

    database.sequelize
        .query('CALL get_lose_date(:game)', {
            replacements: {
                game: game,
            }
        })
        .then(result => callback && callback(result));
}

helper.getLosePeriodSP = (game, date, callback) => {

    database.sequelize
        .query('CALL get_lose_period_by_date(:game, :date)', {
            replacements: {
                game: game,
                date: date,
            }
        })
        .then(result => callback && callback(result));
}

helper.getC1 = (where, callback) => {

    lotteryC1Model.findOne({
        where: where,
    }).then((item) => {
        callback && callback(item);
    });
}

helper.getC2 = (where, callback) => {

    lotteryC2Model.findOne({
        where: where,
    }).then((item) => {
        callback && callback(item);
    });
}

helper.getC3 = (where, callback) => {

    lotteryC3Model.findOne({
        where: where,
    }).then((item) => {
        callback && callback(item);
    });
}

helper.getCt = (where, callback) => {

    lotteryCtModel.findOne({
        where: where,
    }).then((item) => {
        callback && callback(item);
    });
}


helper.getRc = (where, callback) => {

    lotteryRcModel.findOne({
        where: where,
    }).then((item) => {
        callback && callback(item);
    });
}

helper.getPe = (where, callback) => {

    lotteryPeModel.findOne({
        where: where,
    }).then((item) => {
        callback && callback(item);
    });
}

helper.getPk = (where, callback) => {

    lotteryPkModel.findOne({
        where: where,
    }).then((item) => {
        callback && callback(item);
    });
}

helper.getSy = (where, callback) => {

    lotterySyModel.findOne({
        where: where,
    }).then((item) => {
        callback && callback(item);
    });
}

helper.getWn = (where, callback) => {

    lotteryWnModel.findOne({
        where: where,
    }).then((item) => {
        callback && callback(item);
    });
}



helper.addC1 = (row) => {
    database.sequelize
        .query('CALL insert_Lottery_data(:game, :no, :number, :datetime, :period)', {
            replacements: {
                game: 'c1',
                no: row.no,
                number: row.number,
                datetime: row.datetime,
                period: '',
            }
        });
}

helper.addC2 = (row) => {
    database.sequelize
        .query('CALL insert_Lottery_data(:game, :no, :number, :datetime, :period)', {
            replacements: {
                game: 'c2',
                no: row.no,
                number: row.number,
                datetime: row.datetime,
                period: '',

            }
        });
}

helper.addC3 = (row) => {
    database.sequelize
        .query('CALL insert_Lottery_data(:game, :no, :number, :datetime, :period)', {
            replacements: {
                game: 'c3',
                no: row.no,
                number: row.number,
                datetime: row.datetime,
                period: '',
            }
        });
}

helper.addCt = (row) => {
    database.sequelize
        .query('CALL insert_Lottery_data(:game, :no, :number, :datetime, :period)', {
            replacements: {
                game: 'ct',
                no: row.no,
                number: row.number,
                datetime: row.datetime,
                period: '',
            }
        });
}

helper.addRc = (row) => {
    database.sequelize
        .query('CALL insert_Lottery_data(:game, :no, :number, :datetime, :period)', {
            replacements: {
                game: 'rc',
                no: row.no,
                number: row.number,
                datetime: row.datetime,
                period: '',
            }
        });
}

helper.addPe = (row) => {
    database.sequelize
        .query('CALL insert_Lottery_data(:game, :no, :number, :datetime, :period)', {
            replacements: {
                game: 'pe',
                no: row.no,
                number: row.number,
                datetime: row.datetime,
                period: row.period,
            }
        });
}

helper.addPk = (row) => {
    database.sequelize
        .query('CALL insert_Lottery_data(:game, :no, :number, :datetime, :period)', {
            replacements: {
                game: 'pk',
                no: row.no,
                number: row.number,
                datetime: row.datetime,
                period: row.period,
            }
        });
}

helper.addSy = (row) => {
    database.sequelize
        .query('CALL insert_Lottery_data(:game, :no, :number, :datetime, :period)', {
            replacements: {
                game: 'sy',
                no: row.no,
                number: row.number,
                datetime: row.datetime,
                period: '',
            }
        });
}

helper.addWn = (row) => {
    database.sequelize
        .query('CALL insert_Lottery_data(:game, :no, :number, :datetime, :period)', {
            replacements: {
                game: 'wn',
                no: row.no,
                number: row.number,
                datetime: row.datetime,
                period: '',
            }
        });
}

helper.setLosePeriod = (game, period) => {
    //Call Function 紀錄遺漏的期號
    database.sequelize
        .query('CALL set_lottery_lose_record_log(:game, :period)', {
            replacements: {
                game: game,
                period: period,
            }
        });
}

helper.setFixLosePeriodRecord = (game, period) => {
    //Call Function 紀錄修復完成的期號
    database.sequelize
        .query('CALL fix_lottery_lose_record_log(:game, :period)', {
            replacements: {
                game: game,
                period: period,
            }
        });
}

module.exports = helper;