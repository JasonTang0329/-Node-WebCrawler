let config = require('../config/config');
let NanoTimer = require('nanotimer');
let timer = new NanoTimer();
let crawlerC1 = require('./crawler_lottery_c1_helper');
let crawlerC2 = require('./crawler_lottery_c2_helper');
let crawlerC3 = require('./crawler_lottery_c3_helper');

let helper = {};

//==============================================================================
//定期自開檢核

helper.routineCheck = () => {

    timer.setInterval(() => {

        crawlerC1.checkPeriod();
        crawlerC2.checkPeriod();
        crawlerC3.checkPeriod();

    }, '', config.tick.lotterySelfCheck);

};

//==============================================================================

module.exports = helper;