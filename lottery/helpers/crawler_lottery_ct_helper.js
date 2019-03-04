let redisHelper = require('./redis_helper');
let commonHelper = require('./common_helper');
let dbHelper = require('./db_helper');
let lotteryTime = require('../config/lottery_time_ct');
let lotteryTimeHelper = require('./lottery_time_helper');
let request = require('request');
let getZeroPattern = new RegExp(/\b(0+)/gi); //將號碼0移除
let async = require('async');
let dateHelper = require('./date_helper');

let helper = {};

//==============================================================================
//主要取得資料爬蟲

helper.setCt = (where, period) => {
    dbHelper.getCt(where, (item) => {

        if (!item)
            redisHelper.setLotteryWaitCt(period.lastNo);

        // 開獎
        redisHelper.lotteryBingoCt((bingoResult) => {

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

                    dbHelper.addCt(row);
                }
            }

            // 是否還有待開獎期號
            redisHelper.getLotteryWaitCt((lotteryWaitCtResult) => {

                let lotteryWaitCtList = lotteryWaitCtResult.split('|');
                let url;
                let param;

                // 168 開獎網
                url = 'https://api.api68.com/CQShiCai/getBaseCQShiCai.do?lotCode=10002'

                request(url, (error, response, body) => {
                    // console.log('168 開獎網 ' + body);
                    if (body) {
                        try {

                            let json = JSON.parse(body);

                            if (json.result.data.preDrawIssue && json.result.data.preDrawCode && json.result.data.preDrawTime) {

                                // 設定 Lottery
                                param = {
                                    name: '168 開獎網',
                                    no: json.result.data.preDrawIssue,
                                    number: json.result.data.preDrawCode,
                                    dateline: json.result.data.preDrawTime,
                                }

                                let index = lotteryWaitCtList.indexOf(param.no.toString());

                                if (index >= 0)
                                    redisHelper.setLotteryCt(param);
                            }
                        } catch (err) {
                            console.log('Ct:168 開獎網 ' + err);
                        }
                    }
                });

                // 52 開獎網
                url = 'https://www.52kjwang.com/shishicai/ajax?ajaxhandler=GetNewestRecord'

                request(url, (error, response, body) => {

                    // console.log('52 開獎網 ' + body);

                    try {

                        let json = JSON.parse(body);

                        if (json.period && json.numbers && json.drawingTime) {

                            let no = json.period.replace(/-/g, '');
                            let dateline = no.substr(0, 4) + '-' + no.substr(4, 2) + '-' + no.substr(6, 2) + ' ' + json.drawingTime + ':00';

                            // 設定 Lottery
                            param = {
                                name: '52 開獎網',
                                no: no,
                                number: json.numbers,
                                dateline: dateline,
                            }

                            let index = lotteryWaitCtList.indexOf(param.no.toString());

                            if (index >= 0)
                                redisHelper.setLotteryCt(param);
                        }
                    } catch (err) {
                        console.log('Ct:52 開獎網 ' + err);
                    }
                });

                // 86 彩票
                url = 'https://www.86cp.net/bjpks/awardNow?lotteryCode=cqssc'

                request(url, (error, response, body) => {

                    // console.log('86 彩票 ' + body);

                    try {

                        let json = JSON.parse(body);

                        if (json.current.periodNumber && json.current.awardNumbers && json.current.awardTime) {

                            let no = json.current.awardTime.substr(0, 4) + json.current.awardTime.substr(5, 2) + json.current.awardTime.substr(8, 2) + commonHelper.padLeft(json.current.periodNumber, 3);

                            // 設定 Lottery
                            param = {
                                name: '86 彩票',
                                no: no,
                                number: json.current.awardNumbers,
                                dateline: json.current.awardTime,
                            }

                            let index = lotteryWaitCtList.indexOf(param.no.toString());

                            if (index >= 0)
                                redisHelper.setLotteryCt(param);
                        }
                    } catch (err) {
                        console.log('Ct:86 彩票 ' + err);
                    }
                });

                if (commonHelper.getRandomInt(0, 3) == 0) {

                    // 彩票控
                    url = 'http://api.kaijiangtong.com/lottery/?name=cqssc&format=json&uid=896708&token=6249456a422f95dafad9bd20a0934845354d4b05'

                    request(url, (error, response, body) => {

                        // console.log('彩票控 ' + body);

                        try {

                            let json = JSON.parse(body);

                            if (!json.hasOwnProperty('status')) {

                                for (let no of Object.keys(json).reverse()) {

                                    if (no && json[no].number && json[no].dateline) {

                                        // 設定 Lottery
                                        param = {
                                            name: '彩票控',
                                            no: no,
                                            number: json[no].number,
                                            dateline: json[no].dateline,
                                        }

                                        let index = lotteryWaitCtList.indexOf(param.no.toString());

                                        if (index >= 0)
                                            redisHelper.setLotteryCt(param);
                                    }
                                }
                            }
                        } catch (err) {
                            console.log('Ct:彩票控 ' + err);
                        }
                    });
                }

                if (commonHelper.getRandomInt(0, 3) == 0) {

                    // 開彩網
                    url = 'http://ho.apiplus.net/newly.do?token=td69aa3d76b3ac5a9k&code=cqssc&format=json'

                    request(url, (error, response, body) => {
                        if (body && body != '按最新查询间隔务必大于3秒，当前请求间隔(0.00秒)过快') {
                            // console.log('開彩網 ' + body);

                            try {

                                let json = JSON.parse(body);

                                for (let item of json.data) {

                                    if (item.expect && item.opencode && item.opentime) {

                                        // 設定 Lottery
                                        param = {
                                            name: '開彩網',
                                            no: item.expect,
                                            number: item.opencode,
                                            dateline: item.opentime,
                                        }

                                        let index = lotteryWaitCtList.indexOf(param.no.toString());

                                        if (index >= 0)
                                            redisHelper.setLotteryCt(param);
                                    }
                                }
                            } catch (err) {
                                console.log('Ct:開彩網 ' + err);
                                console.log('開彩網 ' + body);
                            }
                        }
                    });
                }
            });
        });
    });
};

//==============================================================================

//==============================================================================
//檢查昨天今天遺漏的期號
helper.checkPeriod = () => {

    let now = new Date();
    let todayLastPeriod = (parseInt(lotteryTimeHelper.getLotteryPeriod(lotteryTime).lastNo) - 1).toString();
    let yesterdayLastPeriod = dateHelper.getYesterdayD(dateHelper.now()) + (now.getHours() == 0 && now.getMinutes() < 10 ? '119' : '120');
    //因00:00才會開120期，所以在00:10前先檢核前一天的119期是否開完

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
        dbHelper.setLosePeriod('ct', lPeriod);
    }
}

//==============================================================================

//==============================================================================
//透過期號呼叫爬蟲開出缺漏號碼

helper.setLostPeriod = (lPeriod, callback) => {
    if (lPeriod) {
        let totalPeriod = (lotteryTime.length - 1);

        //default Period type like 201808130188
        let periodDates = lPeriod.substring(0, 8)
        let losePeriod = parseInt(lPeriod.substring(8, lPeriod.length));
        let addDay = (losePeriod == totalPeriod ? 1 : 0);
        losePeriod = losePeriod == totalPeriod ? 1 : losePeriod + 1;
        let periodDay = periodDates.substring(0, 4) + '-' + periodDates.substring(4, 6) + '-' + periodDates.substring(6, 8);
        let adDate = periodDates.substring(0, 4) + '-' + periodDates.substring(4, 6) + '-' + periodDates.substring(6, 8); //or yyyy-mm-dd 
        adDate = (addDay == 1 ? dateHelper.getTomorrowD(dateHelper.getTS(adDate)) : adDate);
        let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間   
        let period = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, losePeriod);

        where = {
            no: period.lastNo,
        }

        helper.setCtByPeriod(where, period, periodDay, (status) => {
            callback(status);
        });

    }
}

//==============================================================================

//==============================================================================
//將遺漏期號補開入資料表

helper.setCtByPeriod = (where, period, adDate, cb) => {
    dbHelper.getCt(where, (item) => {

        if (!item) {
            let urlArr = ['https://api.api68.com/CQShiCai/getBaseCQShiCaiList.do?lotCode=10002&date=', 'https://www.du43.com/CQShiCai/getBaseCQShiCaiList.do?lotCode=10002&date=', 'http://api.1680210.com/CQShiCai/getBaseCQShiCaiList.do?lotCode=10036&date='];
            async.map(urlArr, (row, callback) => {
                let url = row + adDate;
                request(url, (error, response, body) => {
                    // console.log('api68 開獎網 ' + body);
                    if (body) {
                        try {
                            let json = JSON.parse(body);
                            if (json.result.data.length > 0) {

                                let Periods = json.result.data;
                                let Info = Periods.find(function (row) {
                                    return row.preDrawIssue == where.no;
                                });
                                if (Info) {
                                    let result = {
                                        preDrawIssue: Info.preDrawIssue,
                                        preDrawCode: Info.preDrawCode,
                                    }
                                    callback(null, result);

                                }

                            }
                        } catch (err) {
                            console.log(url + ' ' + err);
                        }
                    }
                });
            }, (err, result) => {
                let array = commonHelper.removeArrayUndefined(result);
                if (array.length > 1) {
                    let basePreDrawIssue = array[0].preDrawIssue;
                    let basePreDrawCode = array[0].preDrawCode;

                    if (array.filter(function (item, idx) {
                            return item.preDrawCode == basePreDrawCode
                        }).length > 1) {
                        let row = {
                            no: basePreDrawIssue,
                            number: basePreDrawCode,
                            datetime: period.openAwardDateTime,
                        }

                        dbHelper.addCt(row);
                        dbHelper.setFixLosePeriodRecord('ct', row.no);
                        cb('success');

                    }
                } else {
                    cb('fail');
                }
            });
        }
    });
};

//==============================================================================

//==============================================================================
//取得遺漏的期號

helper.getLostPeriod = (Period, callback) => {
    if (Period) {
        //取得遺漏的期號
        let game = 'ct';
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
        let no = lotteryTimeHelper.getLotteryPeriodCancelEarlyTime(lotteryTime, 30).lastNo;
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

    let no = lotteryTimeHelper.getLotteryPeriodCancelEarlyTime(lotteryTime, 30).no;
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
//取得指定期數的開獎資料
helper.getPeriodInfo = (period, callback) => {
    let number = parseInt(period.substring(8, period.length)); //從指定期開始起算
    let adDate = period.substring(0, 4) + '-' + period.substring(4, 6) + '-' + period.substring(6, 8); //or yyyy-mm-dd           
    let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
    callback(lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, number));


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
                let nextPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, addDayPeriod);

                if (nextPeriod) {
                    let where = {
                        no: nextPeriod.no,
                    }
                    dbHelper.getCt(where, (item) => {
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
                    dbHelper.getCt(where, (item) => {
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