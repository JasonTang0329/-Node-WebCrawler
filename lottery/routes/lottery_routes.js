let dbHelper = require('../helpers/db_helper');
let async = require('async');
let crawlerC1 = require('../helpers/crawler_lottery_c1_helper');
let crawlerC2 = require('../helpers/crawler_lottery_c2_helper');
let crawlerC3 = require('../helpers/crawler_lottery_c3_helper');
let crawlerCt = require('../helpers/crawler_lottery_ct_helper');
let crawlerPe = require('../helpers/crawler_lottery_pe_helper');
let crawlerPk = require('../helpers/crawler_lottery_pk_helper');
let crawlerRc = require('../helpers/crawler_lottery_rc_helper');
let crawlerSy = require('../helpers/crawler_lottery_sy_helper');
let crawlerWn = require('../helpers/crawler_lottery_wn_helper');

module.exports = (app) => {

    //指定某期開獎資訊
    app.get('/lottery/c1/:no', (req, res) => {
        let result = {}

        let no = req.params.no;

        where = {
            no: no,
        }

        dbHelper.getC1(where, (item) => {
            if (item) {
                result = {
                    item: item
                }

                result.status = 'success';

                res.json(result);
            } else {
                result.status = 'fail';
                res.json(result);

            }
        });

    });

    //指定某期開獎資訊
    app.get('/lottery/c2/:no', (req, res) => {
        let result = {}

        let no = req.params.no;

        where = {
            no: no,
        }

        dbHelper.getC2(where, (item) => {
            if (item) {

                result = {
                    item: item
                }

                result.status = 'success';

                res.json(result);
            } else {
                result.status = 'fail';
                res.json(result);

            }
        });

    });

    //指定某期開獎資訊
    app.get('/lottery/c3/:no', (req, res) => {
        let result = {}

        let no = req.params.no;

        where = {
            no: no,
        }

        dbHelper.getC3(where, (item) => {
            if (item) {

                result = {
                    item: item
                }

                result.status = 'success';

                res.json(result);
            } else {
                result.status = 'fail';
                res.json(result);

            }
        });

    });

    //指定某期開獎資訊
    app.get('/lottery/ct/:no', (req, res) => {
        let result = {}

        let no = req.params.no;

        where = {
            no: no,
        }

        dbHelper.getCt(where, (item) => {
            if (item) {

                result = {
                    item: item
                }

                result.status = 'success';

                res.json(result);
            } else {
                result.status = 'fail';
                res.json(result);

            }
        });

    });

    //指定某期開獎資訊
    app.get('/lottery/rc/:no', (req, res) => {
        let result = {}

        let no = req.params.no;

        where = {
            no: no,
        }

        dbHelper.getRc(where, (item) => {
            if (item) {

                result = {
                    item: item
                }

                result.status = 'success';

                res.json(result);
            } else {
                result.status = 'fail';
                res.json(result);

            }
        });

    });

    //指定某期開獎資訊
    app.get('/lottery/pe/:period', (req, res) => {
        let result = {}

        let period = req.params.period;

        where = {
            period: period,
        }

        dbHelper.getPe(where, (item) => {
            if (item) {

                result = {
                    item: item
                }

                result.status = 'success';

                res.json(result);
            } else {
                result.status = 'fail';
                res.json(result);

            }
        });
    });

    //指定某期開獎資訊
    app.get('/lottery/pk/:period', (req, res) => {
        let result = {}

        let period = req.params.period;

        where = {
            period: period,
        }

        dbHelper.getPk(where, (item) => {
            if (item) {

                result = {
                    item: item
                }

                result.status = 'success';

                res.json(result);
            } else {
                result.status = 'fail';
                res.json(result);

            }
        });
    });


    //指定某期開獎資訊
    app.get('/lottery/sy/:no', (req, res) => {
        let result = {}

        let no = req.params.no;

        where = {
            no: no,
        }

        dbHelper.getSy(where, (item) => {
            if (item) {
                result = {
                    item: item
                }

                result.status = 'success';

                res.json(result);
            } else {
                result.status = 'fail';
                res.json(result);

            }
        });

    });

    //指定某期開獎資訊
    app.get('/lottery/wn/:no', (req, res) => {
        let result = {}

        let no = req.params.no;

        where = {
            no: no,
        }

        dbHelper.getWn(where, (item) => {
            if (item) {

                result = {
                    item: item
                }

                result.status = 'success';

                res.json(result);
            } else {
                result.status = 'fail';
                res.json(result);

            }
        });

    });

    //接下來N期期號資訊
    app.get('/lottery/getNextPeriod/:game/:period', (req, res) => {
        let result = {}

        try {

            let game = req.params.game;
            let periodN = req.params.period;
            let period = '';
            switch (game) {
                case 'c1':
                    period = crawlerC1.getNextPeriod(periodN);
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                case 'c2':
                    period = crawlerC2.getNextPeriod(periodN);
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                case 'c3':
                    period = crawlerC3.getNextPeriod(periodN);
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                case 'ct':
                    period = crawlerCt.getNextPeriod(periodN);
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                case 'pe':
                    crawlerPe.getNextPeriod(periodN, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });
                    break;
                case 'pk':
                    crawlerPk.getNextPeriod(periodN, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });
                    break;
                case 'rc':
                    period = crawlerRc.getNextPeriod(periodN);
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                case 'sy':
                    period = crawlerSy.getNextPeriod(periodN);
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                case 'wn':
                    period = crawlerWn.getNextPeriod(periodN);
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                default:
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
            }


        } catch (error) {
            result.status = 'fail';
            res.json(result);

        }

    });

    //最新N期開獎資訊
    app.get('/lottery/getnewest/:game/:period', (req, res) => {
        let result = {}

        try {

            let game = req.params.game;
            let period = req.params.period;
            items = [];

            dbHelper.getNewestPeriod(game, period, (arr) => {
                async.map(arr, (row) => {

                    let item = {
                        no: row.no,
                        number: row.number,
                        datetime: row.datetime,
                    };
                    if (game == 'pe' || game == 'pk') {
                        item.period = row.period
                    }
                    items.push(item);
                });
                result.item = (items.length > 0 ? items : null);
                result.status = 'success';
                res.json(result);
            });
        } catch (error) {
            result.status = 'fail';
            res.json(result);

        }

    });

    ///指定期號前後N期(含開獎號碼)
    app.get('/lottery/getDesignatePeriod/:game/:period/:num', (req, res) => {
        let result = {}

        try {

            let game = req.params.game;
            let period = req.params.period;
            let num = req.params.num;
            items = [];

            switch (game) {
                case 'c1':
                    crawlerC1.getDesignatePeriod(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });

                    break;
                case 'c2':
                    crawlerC2.getDesignatePeriod(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });

                    break;
                case 'c3':
                    crawlerC3.getDesignatePeriod(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });

                    break;
                case 'ct':
                    crawlerCt.getDesignatePeriod(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });

                    break;
                case 'pe':
                    crawlerPe.getDesignatePeriod(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });
                    break;
                case 'pk':
                    crawlerPk.getDesignatePeriod(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });
                    break;
                case 'rc':
                    crawlerRc.getDesignatePeriod(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });
                    break;
                case 'sy':
                    crawlerSy.getDesignatePeriod(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });

                    break;
                case 'wn':
                    crawlerWn.getDesignatePeriod(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });

                    break;
                default:
                    result.item = null;
                    result.status = 'fail';
                    res.json(result);
                    break;
            }

        } catch (error) {
            result.status = 'fail';
            res.json(result);

        }
    });

    ///指定期號前後N期(不含開獎號碼)
    app.get('/lottery/getDesignatePeriodInfo/:game/:period/:num', (req, res) => {
        let result = {}

        try {

            let game = req.params.game;
            let period = req.params.period;
            let num = req.params.num;
            items = [];

            switch (game) {
                case 'c1':
                    crawlerC1.getDesignatePeriodInfo(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });

                    break;
                case 'c2':
                    crawlerC2.getDesignatePeriodInfo(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });

                    break;
                case 'c3':
                    crawlerC3.getDesignatePeriodInfo(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });

                    break;
                case 'ct':
                    crawlerCt.getDesignatePeriodInfo(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });

                    break;
                case 'pe':
                    crawlerPe.getDesignatePeriodInfo(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });
                    break;
                case 'pk':
                    crawlerPk.getDesignatePeriodInfo(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });
                    break;
                case 'rc':
                    crawlerRc.getDesignatePeriodInfo(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });
                    break;
                case 'sy':
                    crawlerSy.getDesignatePeriodInfo(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });

                    break;
                case 'wn':
                    crawlerWn.getDesignatePeriodInfo(period, num, (item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });

                    break;
                default:
                    result.item = null;
                    result.status = 'fail';
                    res.json(result);
                    break;
            }

        } catch (error) {
            result.status = 'fail';
            res.json(result);

        }
    });
    // 取得該日所有期號
    app.get('/lottery/getAllPeriod/:game/:date', (req, res) => {
        let result = {};

        try {
            let game = req.params.game;
            let date = req.params.date.replace(/\//g, '').replace(/\-/g, '');
            items = [];
            dbHelper.getPeriod(game, date, (arr) => {
                async.map(arr, (row) => {

                    let item = {
                        no: row.no,
                        number: row.number,
                        datetime: row.datetime,
                    };
                    if (game == 'pe' || game == 'pk') {
                        item.period = row.period
                    }
                    items.push(item);
                });
                result.item = (items.length > 0 ? items : null);
                result.status = 'success';
                res.json(result);
            });
        } catch (error) {
            result.status = 'fail';
            res.json(result);
        }

    });

    // 取得當下期號與開獎時間
    app.get('/lottery/getNowPeriod/:game', (req, res) => {
        let result = {};

        try {

            let game = req.params.game;
            let period = '';
            switch (game) {
                case 'c1':
                    period = crawlerC1.getNowPeriod();
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                case 'c2':
                    period = crawlerC2.getNowPeriod();
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                case 'c3':
                    period = crawlerC3.getNowPeriod();
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                case 'ct':
                    period = crawlerCt.getNowPeriod();
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                case 'pe':
                    crawlerPe.getNowPeriod((item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });
                    break;
                case 'pk':
                    crawlerPk.getNowPeriod((item) => {
                        if (item) {
                            period = item;
                        }
                        result.item = (period ? period : null);
                        result.status = (period ? 'success' : 'fail');
                        res.json(result);
                    });
                    break;
                case 'rc':
                    period = crawlerRc.getNowPeriod();
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                case 'sy':
                    period = crawlerSy.getNowPeriod();
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                case 'wn':
                    period = crawlerWn.getNowPeriod();
                    result.item = (period ? period : null);
                    result.status = (period ? 'success' : 'fail');
                    res.json(result);
                    break;
                default:
                    result.item = null;
                    result.status = 'fail';
                    res.json(result);
                    break;
            }

        } catch (error) {
            result.status = 'fail';
            res.json(result);

        }


    });
};