let commonHelper = require('./common_helper');
let dbHelper = require('./db_helper');
let lotteryTime = require('../config/lottery_time_c2');
let lotteryTimeHelper = require('./lottery_time_helper');
let dateHelper = require('./date_helper');
let async = require('async');

let helper = {};

//==============================================================================
//主要取得資料爬蟲

helper.setC2 = (where, period) => {
    dbHelper.getC2(where, (item) => {

        if (!item) {

            let number = [];

            for (let i = 0; i < 5; i++)
                number.push(commonHelper.getRandomInt(0, 9));

            let row = {
                no: period.lastNo,
                number: number.toString(),
                datetime: period.openAwardDateTimeLast,
            }

            dbHelper.addC2(row);
        }
    });
};

//==============================================================================

//==============================================================================
//檢查昨天今天遺漏的期號
helper.checkPeriod = () => {
    let now = new Date();

    let todayLastPeriod = (parseInt(lotteryTimeHelper.getLotteryPeriod(lotteryTime).lastNo) - 1).toString();
    let yesterdayLastPeriod = dateHelper.getYesterdayD(dateHelper.now()) + (now.getHours() == 0 && now.getMinutes() < 2 ? '1379' : '1380');

    helper.getLostPeriod(todayLastPeriod, (result) => {
        if (result) {
            let arr = result.split(',');
            if (arr.length > 0) {
                arr.map(row => {
                    if (row) {
                        helper.setLostPeriodRecord(row.trim());
                    }
                });
            }
        }
    });
    helper.getLostPeriod(yesterdayLastPeriod, (result) => {
        if (result) {
            let arr = result.split(',');
            if (arr.length > 0) {
                async.map(arr, (row) => {
                    if (row) {
                        helper.setLostPeriodRecord(row.trim());
                    }
                });
            }

        }
    });
}
//==============================================================================

//==============================================================================
//直接開出有遺漏的期號

helper.setLostPeriod = (lPeriod, callback) => {

    if (lPeriod) {

        let totalPeriod = (lotteryTime.length - 1);

        //default Period type like 201808130188
        let periodDates = lPeriod.substring(0, 8)
        let losePeriod = parseInt(lPeriod.substring(8, lPeriod.length));
        let addDay = (losePeriod == totalPeriod ? 1 : 0);
        losePeriod = losePeriod == totalPeriod ? 1 : losePeriod + 1;
        let adDate = periodDates.substring(0, 4) + '-' + periodDates.substring(4, 6) + '-' + periodDates.substring(6, 8); //or yyyy-mm-dd 
        adDate = (addDay == 1 ? dateHelper.getTomorrowD(dateHelper.getTS(adDate)) : adDate);
        let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間   
        let period = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, losePeriod);

        where = {
            no: period.lastNo,
        }

        dbHelper.setFixLosePeriodRecord('c2', lPeriod);

        helper.setC2(where, period);
        if (callback) {
            callback('success');
        }
    }
}

//==============================================================================

//==============================================================================
//將遺漏的期號寫入資料表

helper.setLostPeriodRecord = (lPeriod) => {

    if (lPeriod) {
        dbHelper.setLosePeriod('c2', lPeriod);
        helper.setLostPeriod(lPeriod);
    }
}

//==============================================================================

//==============================================================================
//取得遺漏的期號

helper.getLostPeriod = (Period, callback) => {
    if (Period) {
        //取得遺漏的期號
        let game = 'c2';
        let date = Period.substring(0, 8);
        let lastPeriod = Period.substring(8, Period.length);
        dbHelper.getLosePeriod(game, date, lastPeriod, (arr) => {
            return callback(arr[0].result);
        });
    }
}

//==============================================================================

//==============================================================================
//取得下N期期號資訊
//periodN N期

helper.getNextPeriod = (periodN) => {
    let Info = [];
    let totalPeriod = (lotteryTime.length - 1);

    for (let i = 1; i <= periodN; i++) {
        let no = lotteryTimeHelper.getLotteryPeriodCancelEarlyTime(lotteryTime, 5).lastNo;
        let addPeriod = parseInt(no.substring(8, no.length)) + i;
        let addDay = (addPeriod % totalPeriod == 0 ? Math.floor(addPeriod / (totalPeriod + 1)) : Math.floor(addPeriod / totalPeriod));
        let addDayPeriod = (addPeriod % totalPeriod == 0 ? totalPeriod : addPeriod % totalPeriod);
        let adDate = no.substring(0, 4) + '-' + no.substring(4, 6) + '-' + no.substring(6, 8); //or yyyy-mm-dd           
        let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
        if (addDay > 0) {
            ts = dateHelper.getFutureTS(ts, addDay);
        }

        let nextPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, addDayPeriod);
        let NextInfo = {
            no: nextPeriod.no,
            datetime: nextPeriod.openAwardDateTime,
        }

        Info.push(NextInfo);
    }
    return Info;
}

//==============================================================================

//==============================================================================
//取得當下開獎資訊

helper.getNowPeriod = () => {

    let no = lotteryTimeHelper.getLotteryPeriodCancelEarlyTime(lotteryTime, 5).no;
    let periodNum = parseInt(no.substring(8, no.length));
    let adDate = no.substring(0, 4) + '-' + no.substring(4, 6) + '-' + no.substring(6, 8); //or yyyy-mm-dd           
    let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  

    let nowPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, periodNum);
    let NextInfo = {
        no: nowPeriod.no,
        datetime: nowPeriod.openAwardDateTime,
    }
    return NextInfo;
}

//==============================================================================

//==============================================================================
//已perio作為基準期號，往前或往後N期
//period N期

helper.getDesignatePeriod = (period, num, callback) => {
    let fakeArr = [];
    let totalPeriod = (lotteryTime.length - 1);

    if (num == 0) {
        return callback(null);

    } else {
        for (let i = 1; i <= Math.abs(num); i++) {
            fakeArr.push(i);
        }
        async.map(fakeArr, (row, cb) => {
            if (num > 0) {
                let addPeriod = parseInt(period.substring(8, period.length)) + row; //從指定期開始起算
                let addDay = (addPeriod % totalPeriod == 0 ? Math.floor(addPeriod / (totalPeriod + 1)) : Math.floor(addPeriod / totalPeriod));
                let addDayPeriod = (addPeriod % totalPeriod == 0 ? totalPeriod : addPeriod % totalPeriod);
                let adDate = period.substring(0, 4) + '-' + period.substring(4, 6) + '-' + period.substring(6, 8); //or yyyy-mm-dd           
                let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
                if (addDay > 0) {
                    ts = dateHelper.getFutureTS(ts, addDay);
                }
                let nextPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, addDayPeriod);

                if (nextPeriod) {
                    let where = {
                        no: nextPeriod.no,
                    }
                    dbHelper.getC2(where, (item) => {
                        let nextInfo = {
                            no: nextPeriod.no,
                            datetime: nextPeriod.openAwardDateTime,
                        }
                        if (item) {
                            nextInfo.number = item.number;
                        }

                        cb(null, nextInfo);
                    })
                } else {
                    cb(null, null);
                }
            } else {
                let minusPeriod = parseInt(period.substring(8, period.length)) - row;
                let minusDay = (minusPeriod > 0 ? 0 : 1) + (minusPeriod % totalPeriod == 0 ? Math.floor(Math.abs(minusPeriod) / (totalPeriod)) : Math.floor(Math.abs(minusPeriod) / totalPeriod));
                let minuDayPeriod = minusPeriod > 0 ? minusPeriod : totalPeriod - (Math.abs(minusPeriod) % totalPeriod);
                let adDate = period.substring(0, 4) + '-' + period.substring(4, 6) + '-' + period.substring(6, 8); //or yyyy-mm-dd
                let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
                if (minusDay > 0) {
                    ts = dateHelper.getPastTS(ts, minusDay);
                }
                let lastPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, minuDayPeriod);

                if (lastPeriod) {
                    let where = {
                        no: lastPeriod.no,
                    }
                    dbHelper.getC2(where, (item) => {
                        let lastInfo = {
                            no: lastPeriod.no,
                            datetime: lastPeriod.openAwardDateTime,
                        }
                        if (item) {
                            lastInfo.number = item.number;
                        }
                        cb(null, lastInfo);
                    })
                } else {
                    cb(null, null);
                }
            }
        }, (err, result) => {
            return callback(result);
        });
    }


}

//==============================================================================

//==============================================================================
//已perio作為基準期號，往前或往後N期
//period N期

helper.getDesignatePeriodInfo = (period, num, callback) => {
    let fakeArr = [];
    let totalPeriod = (lotteryTime.length - 1);

    if (num == 0) {
        return callback(null);

    } else {
        for (let i = 1; i <= Math.abs(num); i++) {
            fakeArr.push(i);
        }
        async.map(fakeArr, (row, cb) => {
            if (num > 0) {
                let addPeriod = parseInt(period.substring(8, period.length)) + row; //從指定期開始起算
                let addDay = (addPeriod % totalPeriod == 0 ? Math.floor(addPeriod / (totalPeriod + 1)) : Math.floor(addPeriod / totalPeriod));
                let addDayPeriod = (addPeriod % totalPeriod == 0 ? totalPeriod : addPeriod % totalPeriod);
                let adDate = period.substring(0, 4) + '-' + period.substring(4, 6) + '-' + period.substring(6, 8); //or yyyy-mm-dd           
                let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
                if (addDay > 0) {
                    ts = dateHelper.getFutureTS(ts, addDay);
                }
                let nextPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, addDayPeriod);

                if (nextPeriod) {

                    let nextInfo = {
                        no: nextPeriod.no,
                        datetime: nextPeriod.openAwardDateTime,
                    }
                    cb(null, nextInfo);
                } else {
                    cb(null, null);
                }
            } else {
                let minusPeriod = parseInt(period.substring(8, period.length)) - row;
                let minusDay = (minusPeriod > 0 ? 0 : 1) + (minusPeriod % totalPeriod == 0 ? Math.floor(Math.abs(minusPeriod) / (totalPeriod)) : Math.floor(Math.abs(minusPeriod) / totalPeriod));
                let minuDayPeriod = minusPeriod > 0 ? minusPeriod : totalPeriod - (Math.abs(minusPeriod) % totalPeriod);
                let adDate = period.substring(0, 4) + '-' + period.substring(4, 6) + '-' + period.substring(6, 8); //or yyyy-mm-dd
                let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
                if (minusDay > 0) {
                    ts = dateHelper.getPastTS(ts, minusDay);
                }
                let lastPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, minuDayPeriod);

                if (lastPeriod) {

                    let lastInfo = {
                        no: lastPeriod.no,
                        datetime: lastPeriod.openAwardDateTime,
                    }
                    cb(null, lastInfo);
                } else {
                    cb(null, null);
                }
            }
        }, (err, result) => {
            return callback(result);
        });
    }


}

//==============================================================================
module.exports = helper;