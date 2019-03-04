let config = require('../config/config');
let lotteryTime = require('../config/lottery_time_c3');
let lotteryTimeHelper = require('./lottery_time_helper');
let NanoTimer = require('nanotimer');
let timer = new NanoTimer();
let crawler = require('./crawler_lottery_c3_helper');

let helper = {};

//==============================================================================
//定期爬蟲
helper.init = () => {

    timer.setInterval(() => {

        let period = lotteryTimeHelper.getLotteryPeriod(lotteryTime);
        where = {
            no: period.lastNo,
        }
        
        crawler.setC3(where, period);
    }, '', config.tick.lotteryC3);
};

//==============================================================================



module.exports = helper;