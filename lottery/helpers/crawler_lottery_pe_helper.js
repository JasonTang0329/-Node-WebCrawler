let redisHelper = require('./redis_helper');
let commonHelper = require('./common_helper');
let dbHelper = require('./db_helper');
let lotteryTime = require('../config/lottery_time_pe');
let lotteryTimeHelper = require('./lottery_time_helper');
let request = require('request');
let getSpacePattern = new RegExp(/[ ]/g); //將空白取代為,
let dateHelper = require('./date_helper');
let async = require('async');


let helper = {};

//==============================================================================
//主要取得資料爬蟲

helper.setPe = (where, period) => {
    dbHelper.getPe(where, (item) => {

        if (!item)
            redisHelper.setLotteryWaitPe(period.lastNo);

        // 開獎
        redisHelper.lotteryBingoPe((bingoResult) => {
            if (bingoResult) {
                let bingoList = bingoResult.split('|');

                for (let bingoItem of bingoList) {
                    let arr = bingoItem.split('_');
                    let numAndPeriod = arr[1].split(',')
                    let no = arr[0];
                    let number = numAndPeriod[0] + ',' + numAndPeriod[1] + ',' + numAndPeriod[2];
                    let period = numAndPeriod[3];
                    let periodByNo = lotteryTimeHelper.getLotteryPeriodByNo(lotteryTime, no);
                    let row = {
                        no: no,
                        number: number,
                        datetime: periodByNo.openAwardDateTime,
                        period: period,

                    }
                    dbHelper.addPe(row);
                }
            }

            // 是否還有待開獎期號
            redisHelper.getLotteryWaitPe((lotteryWaitPeResult) => {

                let lotteryWaitPeList = lotteryWaitPeResult.split('|');
                let url;
                let param;

                // api68 開獎網
                url = 'https://api.api68.com/LuckTwenty/getPcLucky28List.do'

                request(url, (error, response, body) => {

                    // console.log('api68 開獎網 ' + body);

                    try {

                        let json = JSON.parse(body);

                        if (json.result.data[0].preDrawIssue && json.result.data[0].preDrawCode && json.result.data[0].preDrawTime) {

                            // 設定 Lottery
                            param = {
                                name: 'api68 開獎網',
                                no: where.no,
                                number: json.result.data[0].preDrawCode + ',' + json.result.data[0].preDrawIssue,
                                dateline: json.result.data[0].preDrawTime,
                            }

                            let index = lotteryWaitPeList.indexOf(param.no.toString());

                            if (index >= 0)
                                redisHelper.setLotteryPe(param);
                        }
                    } catch (err) {
                        console.log('Pe:api68 開獎網 ' + err);
                    }
                });

                // 52 開獎網
                url = 'https://www.52kjpk10.com/pcdd/ajax?ajaxhandler=GetXy28AwardData'

                request(url, (error, response, body) => {

                    // console.log('52 開獎網 ' + body);

                    try {

                        let json = JSON.parse(body);

                        if (json.current.periodNumber && json.current.awardNumbers && json.current.awardTime) {


                            // 設定 Lottery
                            param = {
                                name: '52 開獎網',
                                no: where.no,
                                number: json.current.awardNumbers + ',' + json.current.periodNumber,
                                dateline: json.current.awardTime,
                            }

                            let index = lotteryWaitPeList.indexOf(param.no.toString());

                            if (index >= 0)
                                redisHelper.setLotteryPe(param);
                        }
                    } catch (err) {
                        console.log('Pe:52 開獎網 ' + err);
                    }
                });
                if (commonHelper.getRandomInt(0, 3) == 0) {

                    // du43 開獎網
                    url = 'https://www.du43.com/LuckTwenty/getPcLucky28List.do'

                    request(url, (error, response, body) => {
                        if (body && body.substring(0, 1) != '<') {

                            // console.log('du43 開獎網 ' + body);

                            try {

                                let json = JSON.parse(body);
                                if (json.result.data.length > 0 && json.result.data[0].preDrawIssue && json.result.data[0].preDrawCode && json.result.data[0].preDrawTime) {

                                    // 設定 Lottery
                                    param = {
                                        name: 'du43 開獎網',
                                        no: where.no,
                                        number: json.result.data[0].preDrawCode + ',' + json.result.data[0].preDrawIssue,
                                        dateline: json.result.data[0].preDrawTime,
                                    }

                                    let index = lotteryWaitPeList.indexOf(param.no.toString());

                                    if (index >= 0)
                                        redisHelper.setLotteryPe(param);
                                }
                            } catch (err) {
                                console.log('Pe:du43 開獎網 ' + err);
                                console.log('du43 開獎網 ' + body);
                            }
                        }
                    });

                }

                // 168 開獎
                url = 'http://www.21360.net/api/pcdd/ajax.php?_=1534316512528'

                request(url, (error, response, body) => {

                    // console.log('168 開獎 ' + body);

                    try {

                        let json = JSON.parse(body);

                        if (json.Current.Period && json.Current.DrawNumbers && json.Current.DrawTime) {

                            // 設定 Lottery
                            param = {
                                name: '168 開獎',
                                no: where.no,
                                number: json.Current.DrawNumbers + ',' + json.Current.Period,
                                dateline: json.Current.DrawTime,
                            }

                            let index = lotteryWaitPeList.indexOf(param.no.toString());

                            if (index >= 0)
                                redisHelper.setLotteryPe(param);
                        }
                    } catch (err) {
                        console.log('Pe:168 開獎 ' + err);
                    }
                });

                // 150 开奖网
                url = 'http://www.150557c.com/api/newest.php?code=xy28'

                request(url, (error, response, body) => {
                    if (body && body.substring(0, 1) != '<') {
                        // console.log('150 开奖网 ' + body);

                        try {

                            let json = JSON.parse(body);

                            if (json.data.newest.issue && json.data.newest.code && json.data.newest.time) {

                                // 設定 Lottery
                                param = {
                                    name: '150 开奖网',
                                    no: where.no,
                                    number: json.data.newest.code + ',' + json.data.newest.issue,
                                    dateline: json.data.newest.time,
                                }

                                let index = lotteryWaitPeList.indexOf(param.no.toString());

                                if (index >= 0)
                                    redisHelper.setLotteryPe(param);
                            }
                        } catch (err) {
                            console.log('Pe:150 开奖网 ' + err);
                            console.log('150 开奖网 ' + body);
                        }
                    }
                });


                //优乐彩 开奖网
                url = 'https://allyzt.com/api/newest?code=xy28'

                request(url, (error, response, body) => {

                    // console.log('优乐彩 开奖网 ' + body);
                    if (body) {
                        try {

                            let json = JSON.parse(body);

                            if (json.data.newest.issue && json.data.newest.code && json.data.newest.time) {

                                // 設定 Lottery
                                param = {
                                    name: '优乐彩 开奖网',
                                    no: where.no,
                                    number: json.data.newest.code + ',' + json.data.newest.issue,
                                    dateline: json.data.newest.time,
                                }

                                let index = lotteryWaitPeList.indexOf(param.no.toString());

                                if (index >= 0)
                                    redisHelper.setLotteryPe(param);
                            }
                        } catch (err) {
                            console.log('Pe:优乐彩 开奖网 ' + err);
                        }
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
    let yesterdayLastPeriod = dateHelper.getYesterdayD(dateHelper.now()) + '179';

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
        dbHelper.setLosePeriod('pe', lPeriod);
    }
}

//==============================================================================

//==============================================================================
//取得期號對應的NO後呼叫寫入期數

helper.setLostPeriod = (lPeriod, callback) => {
    if (lPeriod) {

        dbHelper.getPeNoByPeriod(lPeriod, (item) => {

            if (item) {
                let no = item[0].newNo;
                let periodDates = no.substring(0, 8)
                let adDate = periodDates.substring(0, 4) + '-' + periodDates.substring(4, 6) + '-' + periodDates.substring(6, 8); //or yyyy-mm-dd   

                let where = {
                    Period: lPeriod,
                }

                helper.setPeByPeriod(where, no, adDate, (item) => {
                    callback(item);
                });
            }
        });
    }
}

//==============================================================================

//==============================================================================
//取得NO對應的期號後呼叫寫入期數

helper.setLostNo = (no, callback) => {
    if (no) {

        let periodDates = no.substring(0, 8)
        let adDate = periodDates.substring(0, 4) + '-' + periodDates.substring(4, 6) + '-' + periodDates.substring(6, 8); //or yyyy-mm-dd  

        dbHelper.getPePeriodByNo(no, (item) => {

            if (item) {
                let where = {
                    Period: item[0].lastPeriod,
                }

                helper.setPeByPeriod(where, no, adDate, (item) => {
                    callback(item);
                });

            }
        })
    }
}

//==============================================================================

//==============================================================================
//將遺漏期號補開入資料表

helper.setPeByPeriod = (where, no, adDate, cb) => {
    dbHelper.getPe(where, (item) => {
        if (!item) {
            let urlArr = ['https://api.api68.com/LuckTwenty/getPcLucky28List.do?date=', 'https://www.du43.com/LuckTwenty/getPcLucky28List.do?date=', 'http://api.1680210.com/LuckTwenty/getPcLucky28List.do?date='];
            async.map(urlArr, (row, callback) => {
                let url = row + adDate;
                request(url, (error, response, body) => {
                    if (body) {
                        try {
                            let json = JSON.parse(body);

                            if (json.result.data.length > 0) {

                                let Periods = json.result.data;
                                let Info = Periods.find(function (row) {
                                    return row.preDrawIssue == where.Period;
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
                        let periodByNo = lotteryTimeHelper.getLotteryPeriodByNo(lotteryTime, no);

                        let row = {
                            no: no,
                            number: basePreDrawCode,
                            datetime: periodByNo.openAwardDateTime,
                            period: basePreDrawIssue,
                        }

                        dbHelper.addPe(row);
                        dbHelper.setFixLosePeriodRecord('pe', row.period);
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
        let game = 'pe';
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

helper.getNextPeriod = (periodN, callback) => {
    let Info = [];
    let fakeArr = [];
    let totalPeriod = (lotteryTime.length - 1);
    let no = lotteryTimeHelper.getLotteryPeriodCancelEarlyTime(lotteryTime, 30).lastNo;

    for (let i = 1; i <= periodN; i++) {
        fakeArr.push(i);
    }

    async.map(fakeArr, (row, callback) => {
        helper.getLoopPeriod(row, totalPeriod, no, (item) => {
            callback(null, item);
        });

    }, (err, result) => {
        return callback(result);
    });

}

//==============================================================================

//==============================================================================
//取得下i期期號
helper.getLoopPeriod = (i, totalPeriod, no, callback) => {
    let addPeriod = parseInt(no.substring(8, no.length)) + i;
    let addDay = (addPeriod % totalPeriod == 0 ? Math.floor(addPeriod / (totalPeriod + 1)) : Math.floor(addPeriod / totalPeriod));
    let addDayPeriod = (addPeriod % totalPeriod == 0 ? totalPeriod : addPeriod % totalPeriod);
    let adDate = no.substring(0, 4) + '-' + no.substring(4, 6) + '-' + no.substring(6, 8); //or yyyy-mm-dd           
    let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
    if (addDay > 0) {
        ts = dateHelper.getFutureTS(ts, addDay);
    }

    let nextPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, addDayPeriod);
    dbHelper.getPePeriodByNo(nextPeriod.no, (item) => {

        let NextInfo = {
            period: item[0].lastPeriod,
            datetime: nextPeriod.openAwardDateTime,
            no: nextPeriod.no,
        }
        return callback(NextInfo);
    });
}

//==============================================================================

//==============================================================================
//取得當下開獎資訊

helper.getNowPeriod = (callback) => {

    let no = lotteryTimeHelper.getLotteryPeriodCancelEarlyTime(lotteryTime, 30).no;
    let periodNum = parseInt(no.substring(8, no.length));
    let adDate = no.substring(0, 4) + '-' + no.substring(4, 6) + '-' + no.substring(6, 8); //or yyyy-mm-dd           
    let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  

    let nowPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, periodNum);
    dbHelper.getPePeriodByNo(nowPeriod.no, (item) => {

        let Info = {
            period: item[0].lastPeriod,
            datetime: nowPeriod.openAwardDateTime,
            no: nowPeriod.no,
        }
        return callback(Info);
    });

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

        dbHelper.getPeNoByPeriod(period, (item) => {
            if (item) {
                let no = item[0].newNo;
                async.map(fakeArr, (row, cb) => {
                    if (num > 0) {
                        let addPeriod = parseInt(no.substring(8, no.length)) + row; //從指定期開始起算
                        let addDay = (addPeriod % totalPeriod == 0 ? Math.floor(addPeriod / (totalPeriod + 1)) : Math.floor(addPeriod / totalPeriod));
                        let addDayPeriod = (addPeriod % totalPeriod == 0 ? totalPeriod : addPeriod % totalPeriod);
                        let adDate = no.substring(0, 4) + '-' + no.substring(4, 6) + '-' + no.substring(6, 8); //or yyyy-mm-dd           
                        let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
                        if (addDay > 0) {
                            ts = dateHelper.getFutureTS(ts, addDay);
                        }
                        let nextPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, addDayPeriod);
                        if (nextPeriod) {
                            let where = {
                                no: nextPeriod.no,
                            }

                            dbHelper.getPe(where, (item) => {
                                let nextInfo = {
                                    no: nextPeriod.no,
                                    datetime: nextPeriod.openAwardDateTime,
                                    period: parseInt(period) + row,
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
                        let minusPeriod = parseInt(no.substring(8, no.length)) - row;

                        let minusDay = (minusPeriod > 0 ? 0 : 1) + (minusPeriod % totalPeriod == 0 ? Math.floor(Math.abs(minusPeriod) / (totalPeriod)) : Math.floor(Math.abs(minusPeriod) / totalPeriod));
                        let minuDayPeriod = minusPeriod > 0 ? minusPeriod : totalPeriod - (Math.abs(minusPeriod) % totalPeriod);
                        let adDate = no.substring(0, 4) + '-' + no.substring(4, 6) + '-' + no.substring(6, 8); //or yyyy-mm-dd
                        let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
                        if (minusDay > 0) {
                            ts = dateHelper.getPastTS(ts, minusDay);
                        }
                        let lastPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, minuDayPeriod);
                        if (lastPeriod) {
                            let where = {
                                no: lastPeriod.no,
                            }

                            dbHelper.getPe(where, (item) => {
                                let lastInfo = {
                                    no: lastPeriod.no,
                                    datetime: lastPeriod.openAwardDateTime,
                                    period: parseInt(period) - row,
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

        dbHelper.getPeNoByPeriod(period, (item) => {
            if (item) {
                let no = item[0].newNo;
                async.map(fakeArr, (row, cb) => {
                    if (num > 0) {
                        let addPeriod = parseInt(no.substring(8, no.length)) + row; //從指定期開始起算
                        let addDay = (addPeriod % totalPeriod == 0 ? Math.floor(addPeriod / (totalPeriod + 1)) : Math.floor(addPeriod / totalPeriod));
                        let addDayPeriod = (addPeriod % totalPeriod == 0 ? totalPeriod : addPeriod % totalPeriod);
                        let adDate = no.substring(0, 4) + '-' + no.substring(4, 6) + '-' + no.substring(6, 8); //or yyyy-mm-dd           
                        let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
                        if (addDay > 0) {
                            ts = dateHelper.getFutureTS(ts, addDay);
                        }
                        let nextPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, addDayPeriod);
                        if (nextPeriod) {
                            let nextInfo = {
                                no: nextPeriod.no,
                                datetime: nextPeriod.openAwardDateTime,
                                period: parseInt(period) + row,
                            }
                            cb(null, nextInfo);
                        } else {
                            cb(null, null);
                        }
                    } else {
                        let minusPeriod = parseInt(no.substring(8, no.length)) - row;

                        let minusDay = (minusPeriod > 0 ? 0 : 1) + (minusPeriod % totalPeriod == 0 ? Math.floor(Math.abs(minusPeriod) / (totalPeriod)) : Math.floor(Math.abs(minusPeriod) / totalPeriod));
                        let minuDayPeriod = minusPeriod > 0 ? minusPeriod : totalPeriod - (Math.abs(minusPeriod) % totalPeriod);
                        let adDate = no.substring(0, 4) + '-' + no.substring(4, 6) + '-' + no.substring(6, 8); //or yyyy-mm-dd
                        let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間  
                        if (minusDay > 0) {
                            ts = dateHelper.getPastTS(ts, minusDay);
                        }
                        let lastPeriod = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, minuDayPeriod);
                        if (lastPeriod) {
                            let lastInfo = {
                                no: lastPeriod.no,
                                datetime: lastPeriod.openAwardDateTime,
                                period: parseInt(period) - row,
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
        });

    }


}

//==============================================================================
module.exports = helper;