let config = require('../config/config');
let redisHelper = require('./redis_helper');
let commonHelper = require('./common_helper');
let dbHelper = require('./db_helper');
let lotteryTime = require('../config/lottery_time_wn');
let lotteryTimeHelper = require('./lottery_time_wn_helper');
let lotteryNormalTimeHelper = require('./lottery_time_helper');

let request = require('request');
let NanoTimer = require('nanotimer');
let timer = new NanoTimer();
let getZeroPattern = new RegExp(/\b(0+)/gi); //將號碼0移除
let dateHelper = require('./date_helper');
let getSpacePattern = new RegExp(/[ ]/g);
let async = require('async');

let helper = {};

//==============================================================================
//主要取得資料爬蟲

helper.setWn = (where, period) => {
    dbHelper.getWn(where, (item) => {
        if (!item)
            redisHelper.setLotteryWaitWn(period.lastNo);

        // 開獎
        redisHelper.lotteryBingoWn((bingoResult) => {
            if (bingoResult) {

                let bingoList = bingoResult.split('|');

                for (let bingoItem of bingoList) {

                    let arr = bingoItem.split('_');
                    let no = arr[0];
                    let number = arr[1];
                    let periodByNo = lotteryTimeHelper.getLotteryPeriodByNo(lotteryTime, no);

                    let row = {
                        no: no,
                        number: number,
                        datetime: periodByNo.openAwardDateTime,
                    }

                    dbHelper.addWn(row);
                }
            }

            // 是否還有待開獎期號
            redisHelper.getLotteryWaitWn((lotteryWaitWnResult) => {

                let lotteryWaitWnList = lotteryWaitWnResult.split('|');
                let url;
                let param;

                // 168 開獎網
                url = 'http://www.21360.net/api/xyft/ajax.php?_=1533863287818'

                request(url, (error, response, body) => {
                    if (body) {

                        // console.log('168 開獎網 ' + body);

                        try {

                            let json = JSON.parse(body);

                            if (json.Current.DrawDate && json.Current.DrawNumbers && json.Current.DrawTime) {

                                // 設定 Lottery
                                param = {
                                    name: '168 開獎',
                                    no: json.Current.DrawDate,
                                    number: json.Current.DrawNumbers.replace(getZeroPattern, ''),
                                    dateline: json.Current.DrawTime,
                                }

                                let index = lotteryWaitWnList.indexOf(param.no.toString());

                                if (index >= 0)
                                    redisHelper.setLotteryWn(param);
                            }
                        } catch (err) {
                            console.log('Wn:168 開獎網 ' + err);
                        }
                    }
                });

                // 150 开奖网
                url = 'http://www.150557c.com/api/newest.php?code=xyft&t=1533864172180'

                request(url, (error, response, body) => {
                    if (body && body.substring(0, 1) != '<') {

                        // console.log('150 开奖网 ' + body);

                        try {

                            let json = JSON.parse(body);

                            if (json.data.newest.issue && json.data.newest.code && json.data.newest.time) {

                                // 設定 Lottery
                                param = {
                                    name: '150 开奖网',
                                    no: json.data.newest.issue,
                                    number: json.data.newest.code.replace(getZeroPattern, ''),
                                    dateline: json.data.newest.time,
                                }

                                let index = lotteryWaitWnList.indexOf(param.no.toString());

                                if (index >= 0)
                                    redisHelper.setLotteryWn(param);
                            }
                        } catch (err) {
                            console.log('Wn:150 开奖网 ' + err);
                            console.log('150 开奖网 ' + body);
                        }
                    }
                });

                // 优乐彩 开奖网
                url = 'https://allyzt.com/api/recent?code=xyft&t=1533864615951'

                request(url, (error, response, body) => {

                    // console.log('优乐彩 开奖网 ' + body);
                    if (body) {

                        try {

                            let json = JSON.parse(body);

                            if (json.data[json.data.length - 1].issue && json.data[json.data.length - 1].code.toString() && json.data[json.data.length - 1].time) {

                                // 設定 Lottery
                                param = {
                                    name: '优乐彩 开奖网',
                                    no: json.data[json.data.length - 1].issue,
                                    number: json.data[json.data.length - 1].code.toString().replace(getZeroPattern, ''),
                                    dateline: json.data[json.data.length - 1].time,
                                }

                                let index = lotteryWaitWnList.indexOf(param.no.toString());

                                if (index >= 0)
                                    redisHelper.setLotteryWn(param);
                            }
                        } catch (err) {
                            console.log('Wn:优乐彩 开奖网 ' + err);
                        }
                    }
                });

                // 手机 开奖网  
                url = 'http://www.86787.com/api/newest?code=xyft&t=1533864982023'

                request(url, (error, response, body) => {

                    // console.log('手机 开奖网  ' + body);

                    try {

                        let json = JSON.parse(body);

                        if (json.data.newest.issue && json.data.newest.code && json.data.newest.time) {

                            // 設定 Lottery
                            param = {
                                name: '手机 开奖网 ',
                                no: json.data.newest.issue,
                                number: json.data.newest.code.toString().replace(getZeroPattern, ''),
                                dateline: json.data.newest.time,
                            }

                            let index = lotteryWaitWnList.indexOf(param.no.toString());

                            if (index >= 0)
                                redisHelper.setLotteryWn(param);
                        }
                    } catch (err) {
                        console.log('Wn:手机 开奖网  ' + err);
                    }
                });

                // 鼎盛 开奖网
                url = 'http://www.hxh66.com/Home/Xyft/getLotteryXyftsInfo.html?issue=&lotCode=10058'

                request(url, (error, response, body) => {

                    // console.log('鼎盛 开奖网 ' + body);

                    try {

                        let json = JSON.parse(body);

                        if (json.result.data.preDrawIssue && json.result.data.preDrawCode && json.result.data.preDrawTime) {

                            // 設定 Lottery
                            param = {
                                name: '鼎盛 开奖网 ',
                                no: json.result.data.preDrawIssue,
                                number: json.result.data.preDrawCode.toString().replace(getZeroPattern, ''),
                                dateline: json.result.data.preDrawTime,
                            }

                            let index = lotteryWaitWnList.indexOf(param.no.toString());

                            if (index >= 0)
                                redisHelper.setLotteryWn(param);
                        }
                    } catch (err) {
                        console.log('Wn:鼎盛 开奖网 ' + err);
                        console.log('鼎盛 开奖网 ' + body);
                    }
                });

            });
        });
    });
};

//==============================================================================

//==============================================================================
//檢查昨天今天遺漏的期號
helper.checkPeriod = () => {

    let todayLastPeriod = (parseInt(lotteryTimeHelper.getLotteryPeriod(lotteryTime).lastNo) - 1).toString();
    let yesterdayLastPeriod = (todayLastPeriod.substring(0, 8) == dateHelper.getYesterdayD(dateHelper.now()) ? dateHelper.getYesterdayD(dateHelper.now()) - 1 : dateHelper.getYesterdayD(dateHelper.now())) + '180';

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
//將遺漏期號寫入資料表
helper.setLostPeriodRecord = (lPeriod) => {
    //將遺漏的期號寫入資料表
    if (lPeriod) {
        dbHelper.setLosePeriod('wn', lPeriod);
    }
}

//==============================================================================

//==============================================================================
//透過期號呼叫爬蟲開出缺漏號碼

helper.getLostPeriod = (Period, callback) => {
    if (Period) {
        //取得遺漏的期號
        let game = 'wn';
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
        let no = lotteryNormalTimeHelper.getLotteryPeriodCancelEarlyTime(lotteryTime, 30).lastNo;
        let addPeriod = parseInt(no.substring(8, no.length)) + i;
        let addDay = (addPeriod % totalPeriod == 0 ? Math.floor(addPeriod / (totalPeriod + 1)) : Math.floor(addPeriod / totalPeriod));
        let addDayPeriod = (addPeriod % totalPeriod == 0 ? totalPeriod : addPeriod % totalPeriod);
        let adDate = no.substring(0, 4) + '-' + no.substring(4, 6) + '-' + no.substring(6, 8); //or yyyy-mm-dd           
        let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
        if (addDay > 0) {
            ts = dateHelper.getFutureTS(ts, addDay);
        }

        let nextPeriod = lotteryNormalTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, addDayPeriod);
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

    let no = lotteryTimeHelper.getLotteryPeriodCancelEarlyTime(lotteryTime, 30).no;
    let periodNum = parseInt(no.substring(8, no.length));
    let adDate = no.substring(0, 4) + '-' + no.substring(4, 6) + '-' + no.substring(6, 8); //or yyyy-mm-dd           
    let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  

    let nowPeriod = lotteryNormalTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, periodNum);
    let NextInfo = {
        no: nowPeriod.no,
        datetime: nowPeriod.openAwardDateTime,
    }
    return NextInfo;
}

//==============================================================================

//==============================================================================
//取得指定期數的開獎資料
helper.getPeriodInfo = (period, callback) => {
    let number = parseInt(period.substring(8, period.length)); //從指定期開始起算
    let adDate = period.substring(0, 4) + '-' + period.substring(4, 6) + '-' + period.substring(6, 8); //or yyyy-mm-dd           
    let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
    callback(lotteryNormalTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, number));


};
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
                let nextPeriod = lotteryNormalTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, addDayPeriod);
                if (nextPeriod) {
                    let where = {
                        no: nextPeriod.no,
                    }
                    dbHelper.getWn(where, (item) => {
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
                let lastPeriod = lotteryNormalTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, minuDayPeriod);
                if (lastPeriod) {
                    let where = {
                        no: lastPeriod.no,
                    }
                    dbHelper.getWn(where, (item) => {
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
                let nextPeriod = lotteryNormalTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, addDayPeriod);
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
                let lastPeriod = lotteryNormalTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, minuDayPeriod);
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