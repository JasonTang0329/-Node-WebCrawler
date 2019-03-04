let config = require('../config/config');
let NanoTimer = require('nanotimer');
let timer = new NanoTimer();
let crawlerCt = require('./crawler_lottery_ct_helper');
let crawlerRc = require('./crawler_lottery_rc_helper');
let crawlerSy = require('./crawler_lottery_sy_helper');
let crawlerWn = require('./crawler_lottery_wn_helper');
let crawlerPe = require('./crawler_lottery_pe_helper');
let crawlerPk = require('./crawler_lottery_pk_helper');

let helper = {};

//==============================================================================
//定期官彩檢核

helper.routineCheck = () => {

    timer.setInterval(() => {

        crawlerCt.checkPeriod();
        crawlerRc.checkPeriod();
        crawlerSy.checkPeriod();
        crawlerWn.checkPeriod();
        crawlerPe.checkPeriod();
        crawlerPk.checkPeriod();

    }, '', config.tick.routineCheck);

};

//==============================================================================

module.exports = helper;