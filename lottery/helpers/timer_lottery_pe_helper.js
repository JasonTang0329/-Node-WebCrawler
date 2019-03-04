let config = require('../config/config');
let lotteryTime = require('../config/lottery_time_pe');
let lotteryTimeHelper = require('./lottery_time_helper');
let NanoTimer = require('nanotimer');
let timer = new NanoTimer();
let crawler = require('./crawler_lottery_pe_helper');

let helper = {};

//==============================================================================
//定期爬蟲
helper.init = () => {

    timer.setInterval(() => {

        let period = lotteryTimeHelper.getLotteryPeriod(lotteryTime);
        where = {
            no: period.lastNo,
        }
        
        crawler.setPe(where, period);
    }, '', config.tick.lotteryPe);
};

//==============================================================================



module.exports = helper;