let async = require('async');
let dbHelper = require('../helpers/db_helper');
let crawlerC1 = require('../helpers/crawler_lottery_c1_helper');
let crawlerC2 = require('../helpers/crawler_lottery_c2_helper');
let crawlerC3 = require('../helpers/crawler_lottery_c3_helper');
let crawlerCt = require('../helpers/crawler_lottery_ct_helper');
let crawlerPe = require('../helpers/crawler_lottery_pe_helper');
let crawlerPk = require('../helpers/crawler_lottery_pk_helper');
let crawlerRc = require('../helpers/crawler_lottery_rc_helper');
let crawlerSy = require('../helpers/crawler_lottery_sy_helper');
let dateHelper = require('../helpers/date_helper');

module.exports = (app) => {
    // 查詢期號
    app.get('/', (req, res) => {
        res.render('period_view');
    });

    // 查詢期號
    app.get('/lostpage', (req, res) => {
        res.render('lost_period_view');
    });

    // 取得日期
    app.post('/period/getDate', (req, res) => {

        let data = req.body;
        let game = data.game;

        dbHelper.getDate(game, (arr) => {

            async.map(arr, (row, callback) => {

                let year = row.date.substr(0, 4);
                let month = row.date.substr(4, 2);
                let day = row.date.substr(6, 2);

                let date = year + '/' + month + '/' + day;

                callback(null, date);
            }, (err, dateList) => {
                res.json(dateList);
            });
        });
    });

    // 取得期號
    app.post('/period/getPeriod', (req, res) => {

        let data = req.body;
        let game = data.game;
        let date = data.date.replace(/\//g, '');

        dbHelper.getPeriod(game, date, (arr) => {

            async.map(arr, (row, callback) => {

                let item = {
                    no: row.no,
                    number: row.number,
                    datetime: row.datetime,
                };
                if (game == "pe" || game == "pk") {
                    item.period = row.period;
                }
                callback(null, item);
            }, (err, periodList) => {
                res.json(periodList);
            });
        });
    });

    // 取得遺失日期
    app.post('/period/getLoseDate', (req, res) => {

        let data = req.body;
        let game = data.game;

        dbHelper.getLoseDate(game, (arr) => {

            async.map(arr, (row, callback) => {
                callback(null, row.findtime);
            }, (err, dateList) => {
                res.json(dateList);
            });
        });
    });

    // 取得遺失期號
    app.post('/period/getLosePeriodSP', (req, res) => {

        let data = req.body;
        let game = data.game;
        let date = data.date.replace(/\//g, '');
        dbHelper.getLosePeriodSP(game, date, (arr) => {

            async.map(arr, (row, callback) => {

                let item = {
                    period: row.period,
                    findtime: dateHelper.getDatetimeFromMysqlDatetime(row.findtime),
                    fixable: (row.fix == 1 ? "已修復" : "尚未修復"),
                    fixtime: row.fixtime ? dateHelper.getDatetimeFromMysqlDatetime(row.fixtime) : "無",

                };
                callback(null, item);
            }, (err, periodList) => {
                res.json(periodList);
            });
        });
    });

    // 取得遺失期號 
    app.post('/getperiod/getLosePeriod', (req, res) => {

        let data = req.body;
        let game = data.game;
        let date = data.date; //input date type 20180808
        let maxPeriod = data.maxPeriod;
        dbHelper.getLosePeriod(game, date, maxPeriod, (arr) => {
            async.map(arr, (row, callback) => {

                let item = {
                    losePeriod: row.result,
                };
                callback(null, item);
            }, (err, periodList) => {
                res.json(periodList);
            });
        });
    });

    //補回遺失號碼
    app.post('/setperiod/setLosePeriod', (req, res) => {

        let data = req.body;
        let game = data.game;
        let period = data.period;
        let arr = period.split(',');
        if (arr.length > 0) {
            async.map(arr, (row, callback) => {
                if (row) {
                    switch (game) {
                        case 'c1':
                            crawlerC1.setLostPeriod(row.trim(), (status) => {
                                res.json(status);

                            });

                            break;
                        case 'c2':
                            crawlerC2.setLostPeriod(row.trim(), (status) => {
                                res.json(status);

                            });

                            break;
                        case 'c3':
                            crawlerC3.setLostPeriod(row.trim(), (status) => {
                                res.json(status);

                            });

                            break;
                        case 'ct':
                            crawlerCt.setLostPeriod(row.trim(), (status) => {
                                res.json(status);

                            });

                            break;
                        case 'pe':
                            if (period.length == 6) { //use period
                                crawlerPe.setLostPeriod(row.trim(), (status) => {
                                    res.json(status);

                                })
                            }
                            if (period.length == 11) { //use no
                                status = crawlerPe.setLostNo(row.trim(), (status) => {
                                    res.json(status);
                                })
                            }
                            break;
                        case 'pk':
                            if (period.length == 6) { //use period
                                crawlerPk.setLostPeriod(row.trim(), (status) => {
                                    res.json(status);

                                });

                            }
                            if (period.length == 11) { //use no
                                crawlerPk.setLostNo(row.trim(), (status) => {
                                    res.json(status);

                                });

                            }
                            break;
                        case 'rc':
                            crawlerRc.setLostPeriod(row.trim(), (status) => {
                                res.json(status);

                            });

                            break;
                        case 'sy':
                            crawlerSy.setLostPeriod(row.trim(), (status) => {
                                res.json(status);

                            });

                            break;
                        default:
                            let item = {
                                losePeriod: row,
                                game: game
                            };
                            item.status = (period ? 'success' : 'fail');
                            res.json(item);
                            break;
                    }
                }

            });
        }
    });

    //補回遺失號碼(幸運飛艇 手動)
    app.post('/setperiod/setLosePeriodByArtificial', (req, res) => {

        let data = req.body;
        let game = data.game;
        let datetime = data.datetime;

        let no = (game != 'pe' && game != 'pk' ? data.no : '');
        let number = data.number;
        let period = (game == 'pe' || game == 'pk' ? data.period : '');
        let where = {
            no: no,
        }
        switch (game) {
            case 'ct':
                dbHelper.getCt(where, (item) => {
                    if (!item) {
                        crawlerCt.getPeriodInfo(no, (item) => {
                            if (item) {
                                let row = {
                                    no: no,
                                    number: number,
                                    period: period,
                                    datetime: item.openAwardDateTime,
                                }
                                dbHelper.addCt(row);
                                dbHelper.setFixLosePeriodRecord('ct', row.no);
                                res.json('新增成功');
                            }
                        })
                    } else {
                        res.json('該期已存在');
                    }
                })
                break;
            case 'pe':
                dbHelper.getPeNoByPeriod(period, (peno) => {
                    where.no = peno[0].newNo;
                    dbHelper.getPe(where, (item) => {
                        if (!item) {
                            crawlerPe.getPeriodInfo(where.no, (item) => {
                                if (item) {
                                    let row = {
                                        no: where.no,
                                        number: number,
                                        period: period,
                                        datetime: item.openAwardDateTime,
                                    }
                                    dbHelper.addPe(row);
                                    dbHelper.setFixLosePeriodRecord('pe', row.period);
                                    res.json('新增成功');
                                }
                            })
                        } else {
                            res.json('該期已存在');
                        }
                    })
                })
                break;
            case 'pk':
                dbHelper.getPkNoByPeriod(period, (pkno) => {
                    where.no = pkno[0].newNo;
                    dbHelper.getPk(where, (item) => {
                        if (!item) {
                            crawlerPk.getPeriodInfo(where.no, (item) => {
                                if (item) {
                                    let row = {
                                        no: where.no,
                                        number: number,
                                        period: period,
                                        datetime: item.openAwardDateTime,
                                    }
                                    dbHelper.addPk(row);
                                    dbHelper.setFixLosePeriodRecord('pk', row.period);
                                    res.json('新增成功');
                                }
                            })
                        } else {
                            res.json('該期已存在');
                        }
                    })

                })
                break;
            case 'rc':
                dbHelper.getRc(where, (item) => {
                    if (!item) {
                        crawlerRc.getPeriodInfo(no, (item) => {
                            if (item) {
                                let row = {
                                    no: no,
                                    number: number,
                                    period: period,
                                    datetime: item.openAwardDateTime,
                                }
                                dbHelper.addRc(row);
                                dbHelper.setFixLosePeriodRecord('rc', row.no);
                                res.json('新增成功');
                            }
                        })
                    } else {
                        res.json('該期已存在');
                    }
                })
                break;
            case 'sy':
                dbHelper.getSy(where, (item) => {
                    if (!item) {
                        crawlerSy.getPeriodInfo(no, (item) => {
                            if (item) {
                                let row = {
                                    no: no,
                                    number: number,
                                    period: period,
                                    datetime: item.openAwardDateTime,
                                }
                                dbHelper.addSy(row);
                                dbHelper.setFixLosePeriodRecord('sy', row.no);
                                res.json('新增成功');
                            }
                        })
                    } else {
                        res.json('該期已存在');
                    }
                })
                break;
            case 'wn':
                dbHelper.getWn(where, (item) => {
                    if (!item) {
                        crawlerWn.getPeriodInfo(no, (item) => {
                            if (item) {
                                let row = {
                                    no: no,
                                    number: number,
                                    period: period,
                                    datetime: item.openAwardDateTime,
                                }
                                dbHelper.addWn(row);
                                dbHelper.setFixLosePeriodRecord('wn', row.no);
                                res.json('新增成功');
                            }
                        })
                    } else {
                        res.json('該期已存在');
                    }
                })
                break;
            default:
                break;
        }
    });



};