let dateHelper = require('./date_helper');
let helper = {};

//==============================================================================

// 取得目前期數
helper.getLotteryPeriod = (lotteryTime, timestamp) => {

    let period = {};
    let ts = timestamp || dateHelper.now();
    let todayD = dateHelper.getTodayD(ts);
    let yesterdayD = dateHelper.getYesterdayD(ts);
    let tomorrowD = dateHelper.getTomorrowD(ts);
    let startOfTodayTS = +dateHelper.getStartOfTodayTS(ts);

    for (let [index, item] of lotteryTime.entries()) {

        let startTS = startOfTodayTS + item[1];
        let endTS = startOfTodayTS + item[2];
        let openAwardDT = startOfTodayTS + item[3];
        let openAwardDTLast = startOfTodayTS + item[4];
        let lotteryDT = startOfTodayTS + item[5];
        if (startTS <= ts && ts < endTS) {

            period.startDT = dateHelper.getDT(startTS);
            period.stopBetDateTime = dateHelper.getDT(endTS);
            period.openAwardDateTime = dateHelper.getDT(openAwardDT);
            period.openAwardDateTimeLast = dateHelper.getDT(openAwardDTLast);
            period.lotteryDateTime = dateHelper.getDT(lotteryDT);

            if (index == 0)
                period.lastNo = yesterdayD + lotteryTime[lotteryTime.length - 2][0];
            else
                period.lastNo = todayD + lotteryTime[index - 1][0];

            if (index == lotteryTime.length - 1)
                period.no = tomorrowD + item[0];
            else
                period.no = todayD + item[0];
        }
    }

    return period;
}
//==============================================================================

//==============================================================================
// 依期號取得目前期數
helper.getLotteryPeriodByNo = (lotteryTime, no) => {

    let period = {};
    let year = no.substr(0, 4);
    let month = no.substr(4, 2);
    let day = no.substr(6, 2);
    let id = no.substr(8);
    let dateToday = year + '-' + month + '-' + day + ' 00:00:00';
    let startOfTodayTS = parseInt(dateHelper.getTS(dateToday));
    let todayD = dateHelper.getTodayD(startOfTodayTS);
    let yesterdayD = dateHelper.getYesterdayD(startOfTodayTS);
    let tomorrowD = dateHelper.getTomorrowD(startOfTodayTS);

    for (let [index, item] of lotteryTime.entries()) {

        if (item[0] == id) {

            let startTS = startOfTodayTS + item[1];
            let endTS = startOfTodayTS + item[2];
            let openAwardDT = startOfTodayTS + item[3];
            let openAwardDTLast = startOfTodayTS + item[4];
            let lotteryDT = startOfTodayTS + item[5];

            period.startDT = dateHelper.getDT(startTS);

            period.stopBetDateTime = dateHelper.getDT(endTS);
            period.openAwardDateTime = dateHelper.getDT(openAwardDT);
            period.openAwardDateTimeLast = dateHelper.getDT(openAwardDTLast);
            period.lotteryDateTime = dateHelper.getDT(lotteryDT);

            if (index == 0)
                period.lastNo = yesterdayD + lotteryTime[lotteryTime.length - 2][0];
            else
                period.lastNo = todayD + lotteryTime[index - 1][0];

            if (index == lotteryTime.length - 1)
                period.no = tomorrowD + item[0];
            else
                period.no = todayD + item[0];

            break;
        }
    }

    return period;
}
//==============================================================================

//==============================================================================
// 取得指定期數資料
helper.getSpecificLotteryPeriod = (lotteryTime, timestamp, periodNum) => {

    let period = {};
    let ts = timestamp || dateHelper.now();
    let todayD = dateHelper.getTodayD(ts);
    let yesterdayD = dateHelper.getYesterdayD(ts);
    let tomorrowD = dateHelper.getTomorrowD(ts);
    let startOfTodayTS = +dateHelper.getStartOfTodayTS(ts);

    for (let [index, item] of lotteryTime.entries()) {
        if (item[0] == periodNum) {
            let startTS = startOfTodayTS + item[1];
            let endTS = startOfTodayTS + item[2];
            let openAwardDT = startOfTodayTS + item[3];
            let openAwardDTLast = startOfTodayTS + item[4];
            let lotteryDT = startOfTodayTS + item[5];

            period.startDT = dateHelper.getDT(startTS);
            period.stopBetDateTime = dateHelper.getDT(endTS);
            period.openAwardDateTime = dateHelper.getDT(openAwardDT);
            period.openAwardDateTimeLast = dateHelper.getDT(openAwardDTLast);
            period.lotteryDateTime = dateHelper.getDT(lotteryDT);

            if (index == 0)
                period.lastNo = yesterdayD + lotteryTime[lotteryTime.length - 2][0];
            else
                period.lastNo = todayD + lotteryTime[index - 1][0];

            if (index == lotteryTime.length - 1)
                period.no = tomorrowD + item[0];
            else
                period.no = todayD + item[0];



            break;
        }
    }

    return period;
}

//==============================================================================

//==============================================================================
// 取消提早封盤時間
helper.getLotteryPeriodCancelEarlyTime = (lotteryTime, latetime, timestamp) => {

    let period = {};
    let ts = timestamp || dateHelper.now();
    let todayD = dateHelper.getTodayD(ts);
    let yesterdayD = dateHelper.getYesterdayD(ts);
    let tomorrowD = dateHelper.getTomorrowD(ts);
    let startOfTodayTS = +dateHelper.getStartOfTodayTS(ts);

    for (let [index, item] of lotteryTime.entries()) {

        let startTS = startOfTodayTS + item[1] + latetime;
        let endTS = startOfTodayTS + item[2] + latetime;
        let openAwardDT = startOfTodayTS + item[3];
        let openAwardDTLast = startOfTodayTS + item[4];
        let lotteryDT = startOfTodayTS + item[5];
        if (startTS <= ts && ts < endTS) {

            period.startDT = dateHelper.getDT(startTS);
            period.stopBetDateTime = dateHelper.getDT(endTS);
            period.openAwardDateTime = dateHelper.getDT(openAwardDT);
            period.openAwardDateTimeLast = dateHelper.getDT(openAwardDTLast);
            period.lotteryDateTime = dateHelper.getDT(lotteryDT);

            if (index == 0)
                period.lastNo = yesterdayD + lotteryTime[lotteryTime.length - 2][0];
            else
                period.lastNo = todayD + lotteryTime[index - 1][0];

            if (index == lotteryTime.length - 1)
                period.no = tomorrowD + item[0];
            else
                period.no = todayD + item[0];
        }
    }
    return period;
}
//==============================================================================


module.exports = helper;