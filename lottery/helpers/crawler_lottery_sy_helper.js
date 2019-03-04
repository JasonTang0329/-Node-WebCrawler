let redisHelper = require('./redis_helper');
let commonHelper = require('./common_helper');
let dbHelper = require('./db_helper');
let lotteryTime = require('../config/lottery_time_sy');
let lotteryTimeHelper = require('./lottery_time_helper');
let request = require('request');
let getZeroPattern = new RegExp(/\b(0+)/gi); //將號碼0移除
let getSpacePattern = new RegExp(/[ ]/g); //將空白取代為,
let dateHelper = require('./date_helper');
let async = require('async');

let helper = {};


//==============================================================================
//主要取得資料爬蟲

helper.setSy = (where, period) => {
    dbHelper.getSy(where, (item) => {

        if (!item)
            redisHelper.setLotteryWaitSy(period.lastNo);

        // 開獎
        redisHelper.lotteryBingoSy((bingoResult) => {

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

                    dbHelper.addSy(row);
                }
            }

            // 是否還有待開獎期號
            redisHelper.getLotteryWaitSy((lotteryWaitSyResult) => {

                let lotteryWaitSyList = lotteryWaitSyResult.split('|');
                let url;
                let param;

                // 168 開獎網
                url = 'https://api.api68.com/ElevenFive/getElevenFiveList.do?&lotCode=10015'

                request(url, (error, response, body) => {

                    // console.log('168 開獎網 ' + body);
                    if (body) {
                        try {

                            let json = JSON.parse(body);

                            if (json.result.data[0].preDrawIssue && json.result.data[0].preDrawCode && json.result.data[0].preDrawTime) {

                                // 設定 Lottery
                                param = {
                                    name: '168 開獎網',
                                    no: json.result.data[0].preDrawIssue,
                                    number: json.result.data[0].preDrawCode.replace(getZeroPattern, ''),
                                    dateline: json.result.data[0].preDrawTime,
                                }

                                let index = lotteryWaitSyList.indexOf(param.no.toString());

                                if (index >= 0)
                                    redisHelper.setLotterySy(param);
                            }
                        } catch (err) {
                            console.log('Sy:168 開獎網 ' + err);
                        }
                    }
                });

                // 360彩票网
                url = 'https://chart.cp.360.cn/zst/qkj/?lotId=168009'

                request(url, (error, response, body) => {

                    // console.log('360彩票网 ' + body);

                    try {

                        let json = JSON.parse(body);

                        if (json[0].Issue && json[0].WinNumber && json[0].EndTime) {

                            let no = json[0].Issue;
                            let dateline = json[0].EndTime;
                            let number = json[0].WinNumber.replace(getSpacePattern, ',').replace(getZeroPattern, '');
                            // 設定 Lottery
                            param = {
                                name: '360彩票网',
                                no: no,
                                number: number,
                                dateline: dateline,
                            }

                            let index = lotteryWaitSyList.indexOf(param.no.toString());

                            if (index >= 0)
                                redisHelper.setLotterySy(param);
                        }
                    } catch (err) {
                        console.log('Sy:360彩票网 ' + err);
                    }
                });

                // 好彩网
                url = 'https://381674.com/Result/GetLotteryResultList?gameID=46'

                request(url, (error, response, body) => {
                    if (body) {
                        // console.log('好彩网 ' + body);

                        try {

                            let json = JSON.parse(body);

                            if (json.list[0].period && json.list[0].result && json.list[0].date) {

                                // 設定 Lottery
                                param = {
                                    name: '好彩网',
                                    no: json.list[0].period,
                                    number: json.list[0].result,
                                    dateline: json.list[0].date,
                                }

                                let index = lotteryWaitSyList.indexOf(param.no.toString());

                                if (index >= 0)
                                    redisHelper.setLotterySy(param);
                            }
                        } catch (err) {
                            console.log('Sy:好彩网 ' + err);
                            console.log(body);
                        }
                    }
                });

                if (commonHelper.getRandomInt(0, 3) == 0) {
                    // DU43開獎網 
                    url = 'https://www.du43.com/ElevenFive/getElevenFiveList.do?date=&lotCode=10015'

                    request(url, (error, response, body) => {
                        if (body && body.substring(0, 1) != '<') {

                            // console.log('DU43開獎網 ' + body);

                            try {

                                let json = JSON.parse(body);

                                if (json.result.data.length > 0 && json.result.data[0].preDrawIssue && json.result.data[0].preDrawCode && json.result.data[0].preDrawTime) {

                                    // 設定 Lottery
                                    param = {
                                        name: 'DU43開獎網',
                                        no: json.result.data[0].preDrawIssue,
                                        number: json.result.data[0].preDrawCode.replace(getZeroPattern, ''),
                                        dateline: json.result.data[0].preDrawTime,
                                    }

                                    let index = lotteryWaitSyList.indexOf(param.no.toString());

                                    if (index >= 0)
                                        redisHelper.setLotterySy(param);
                                }
                            } catch (err) {
                                console.log('Sy:DU43開獎網 ' + err);
                                console.log('DU43開獎網 ' + body);
                            }
                        }
                    });
                }

                // 彩客网 (偶爾資料會慢)
                url = 'http://www.310win.com/Info/Result/High.aspx?load=ajax&typeID=119&date=' + dateHelper.getDateToday()

                request(url, (error, response, body) => {

                    // console.log('彩客网 ' + body);

                    try {

                        let json = JSON.parse(body);
                        if (json.Table.length > 0) {
                            if (json.Table[0].IssueNum && json.Table[0].Result && json.Table[0].AwardTime) {

                                // 設定 Lottery
                                param = {
                                    name: '彩客网',
                                    no: '20' + json.Table[0].IssueNum,
                                    number: json.Table[0].Result.replace(getZeroPattern, '').replace(getSpacePattern, ','),
                                    dateline: json.Table[0].AwardTime,
                                }

                                let index = lotteryWaitSyList.indexOf(param.no.toString());

                                if (index >= 0)
                                    redisHelper.setLotterySy(param);
                            }
                        }
                    } catch (err) {
                        console.log('Sy:彩客网 ' + err);
                    }
                });


                if (commonHelper.getRandomInt(0, 3) == 0) {
                    //彩之家 偶爾會404掉資料
                    url = 'http://www.91333.com/api/caipiao/get_luzhu?id=jx11x5'
                    //
                    request(url, (error, response, body) => {
                        if (body && body != '{"status":-1,"m":"获取数据异常！"}' && body != '503 Bad Gateway' && body.substring(0, 1) != '<') {
                            // console.log('彩之家 ' + body);
                            //
                            try {
                                //
                                let json = JSON.parse(body);
                                //
                                if (json.rows[0].termNum && json.rows[0].n1 && json.rows[0].n2 && json.rows[0].n3 && json.rows[0].n4 && json.rows[0].n5 && json.rows[0].lotteryTime) {
                                    //
                                    // 設定 Lottery
                                    param = {
                                        name: '彩之家',
                                        no: json.rows[0].termNum,
                                        number: json.rows[0].n1 + "," + json.rows[0].n2 + "," + json.rows[0].n3 + "," + json.rows[0].n4 + "," + json.rows[0].n5,
                                        dateline: json.rows[0].lotteryTime,
                                    }
                                    //
                                    let index = lotteryWaitSyList.indexOf(param.no.toString());
                                    //
                                    if (index >= 0)
                                        redisHelper.setLotterySy(param);
                                }
                            } catch (err) {
                                console.log('Sy:彩之家 ' + err);
                                console.log(body);
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
//將遺漏期號補寫入資料表

helper.setLostPeriodRecord = (lPeriod) => {
    //將遺漏的期號寫入資料表
    if (lPeriod) {
        dbHelper.setLosePeriod('sy', lPeriod);
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
        let adDate = periodDates.substring(0, 4) + '-' + periodDates.substring(4, 6) + '-' + periodDates.substring(6, 8); //or yyyy-mm-dd 
        adDate = (addDay == 1 ? dateHelper.getTomorrowD(dateHelper.getTS(adDate)) : adDate);
        let ts = dateHelper.getTS(adDate); //Date 內無值的話為當前時間   
        let period = lotteryTimeHelper.getSpecificLotteryPeriod(lotteryTime, ts, losePeriod);

        where = {
            no: period.lastNo,
        }

        //console.log(where, period, adDate);
        helper.setSyByPeriod(where, period, adDate, (status) => {
            callback(status);
        });


    }
}

//==============================================================================

//==============================================================================
//檢查昨天今天遺漏的期號
helper.checkPeriod = () => {
    let todayLastPeriod = (parseInt(lotteryTimeHelper.getLotteryPeriod(lotteryTime).lastNo) - 1).toString();
    let yesterdayLastPeriod = dateHelper.getYesterdayD(dateHelper.now()) + '84';

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
//將遺漏期號補開入資料表

helper.setSyByPeriod = (where, period, adDate, cb) => {
    dbHelper.getSy(where, (item) => {

        if (!item) {
            let urlArr = ['https://api.api68.com/ElevenFive/getElevenFiveList.do?&lotCode=10015&date=', 'https://www.du43.com/ElevenFive/getElevenFiveList.do?&lotCode=10015&date=', 'http://api.1680210.com/ElevenFive/getElevenFiveList.do?&lotCode=10015&date='];
            async.map(urlArr, (row, callback) => {
                let url = row + adDate;
                request(url, (error, response, body) => {
                    if (body) {

                        // console.log('api68 開獎網 ' + body);
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

                        dbHelper.addSy(row);
                        dbHelper.setFixLosePeriodRecord('sy', row.no);
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
        let game = 'sy';
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
                    dbHelper.getSy(where, (item) => {
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
                    dbHelper.getSy(where, (item) => {
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
                    if (item) {
                        nextInfo.number = item.number;
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
                    if (item) {
                        lastInfo.number = item.number;
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