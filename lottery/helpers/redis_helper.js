let config = require('../config/config');
let keys = require('../../keys');
let redis = require("redis");
let redisClient = redis.createClient({
    port: config.redis.port,
    host: config.redis.host,
    auth_pass: config.redis.password,
    return_buffers: true,
});

let helper = {};

//==============================================================================

// 開獎 Lottery (CT)
helper.lotteryBingoCt = (callback) => {

    redisClient.evalsha(keys['lottery_bingo_ct'], 0, (err, result) => {

        if (err) {
            console.log('開獎 Lottery (CT)');
            console.log(err);
        }

        if (result)
            (!err) && callback && callback(result.toString());
        else
            (!err) && callback && callback();
    });
}

// 設定待開獎 Lottery (CT)
helper.setLotteryWaitCt = (no) => {

    redisClient.evalsha(keys['set_lottery_wait_ct'], 0, no, (err) => {

        if (err) {
            console.log('設定待開獎 Lottery (CT)');
            console.log(no);
            console.log(err);
        }
    });
}

// 取得待開獎 Lottery (CT)
helper.getLotteryWaitCt = (callback) => {

    redisClient.evalsha(keys['get_lottery_wait_ct'], 0, (err, result) => {

        if (err) {
            console.log('取得待開獎 Lottery (CT)');
            console.log(err);
        }

        (!err) && result && callback && callback(result.toString());
    });
}

// 設定 Lottery
helper.setLotteryCt = (param) => {

    redisClient.evalsha(keys['set_lottery_ct'], 0, param.name, param.no, param.number, param.dateline, (err) => {

        if (err) {
            console.log('設定 Lottery');
            console.log(param);
            console.log(err);
        }
    });
}

//==============================================================================

//==============================================================================

// 開獎 Lottery (RC)
helper.lotteryBingoRc = (callback) => {

    redisClient.evalsha(keys['lottery_bingo_rc'], 0, (err, result) => {

        if (err) {
            console.log('開獎 Lottery (RC)');
            console.log(err);
        }

        if (result)
            (!err) && callback && callback(result.toString());
        else
            (!err) && callback && callback();
    });
}

// 設定待開獎 Lottery (RC)
helper.setLotteryWaitRc = (no) => {

    redisClient.evalsha(keys['set_lottery_wait_rc'], 0, no, (err) => {

        if (err) {
            console.log('設定待開獎 Lottery (RC)');
            console.log(no);
            console.log(err);
        }
    });
}

// 取得待開獎 Lottery (RC)
helper.getLotteryWaitRc = (callback) => {

    redisClient.evalsha(keys['get_lottery_wait_rc'], 0, (err, result) => {

        if (err) {
            console.log('取得待開獎 Lottery (RC)');
            console.log(err);
        }

        (!err) && result && callback && callback(result.toString());
    });
}

// 設定 Lottery
helper.setLotteryRc = (param) => {

    redisClient.evalsha(keys['set_lottery_rc'], 0, param.name, param.no, param.number, param.dateline, (err) => {

        if (err) {
            console.log('設定 Lottery');
            console.log(param);
            console.log(err);
        }
    });
}

//==============================================================================

//==============================================================================

// 開獎 Lottery (PE)
helper.lotteryBingoPe = (callback) => {

    redisClient.evalsha(keys['lottery_bingo_pe'], 0, (err, result) => {

        if (err) {
            console.log('開獎 Lottery (PE)');
            console.log(err);
        }

        if (result)
            (!err) && callback && callback(result.toString());
        else
            (!err) && callback && callback();
    });
}

// 設定待開獎 Lottery (PE)
helper.setLotteryWaitPe = (no) => {

    redisClient.evalsha(keys['set_lottery_wait_pe'], 0, no, (err) => {

        if (err) {
            console.log('設定待開獎 Lottery (PE)');
            console.log(no);
            console.log(err);
        }
    });
}

// 取得待開獎 Lottery (PE)
helper.getLotteryWaitPe = (callback) => {

    redisClient.evalsha(keys['get_lottery_wait_pe'], 0, (err, result) => {

        if (err) {
            console.log('取得待開獎 Lottery (PE)');
            console.log(err);
        }

        (!err) && result && callback && callback(result.toString());
    });
}

// 設定 Lottery
helper.setLotteryPe = (param) => {

    redisClient.evalsha(keys['set_lottery_pe'], 0, param.name, param.no, param.number, param.dateline, (err) => {
        if (err) {
            console.log('設定 Lottery');
            console.log(param);
            console.log(err);
        }
    });
}

//==============================================================================

//==============================================================================

// 開獎 Lottery (PK)
helper.lotteryBingoPk = (callback) => {

    redisClient.evalsha(keys['lottery_bingo_pk'], 0, (err, result) => {

        if (err) {
            console.log('開獎 Lottery (PK)');
            console.log(err);
        }

        if (result)
            (!err) && callback && callback(result.toString());
        else
            (!err) && callback && callback();
    });
}

// 設定待開獎 Lottery (PK)
helper.setLotteryWaitPk = (no) => {

    redisClient.evalsha(keys['set_lottery_wait_pk'], 0, no, (err) => {

        if (err) {
            console.log('設定待開獎 Lottery (PK)');
            console.log(no);
            console.log(err);
        }
    });
}

// 取得待開獎 Lottery (PK)
helper.getLotteryWaitPk = (callback) => {

    redisClient.evalsha(keys['get_lottery_wait_pk'], 0, (err, result) => {

        if (err) {
            console.log('取得待開獎 Lottery (PK)');
            console.log(err);
        }

        (!err) && result && callback && callback(result.toString());
    });
}

// 設定 Lottery
helper.setLotteryPk = (param) => {

    redisClient.evalsha(keys['set_lottery_pk'], 0, param.name, param.no, param.number, param.dateline, (err) => {
        if (err) {
            console.log('設定 Lottery');
            console.log(param);
            console.log(err);
        }
    });
}

//==============================================================================

//==============================================================================

// 開獎 Lottery (SY)
helper.lotteryBingoSy = (callback) => {

    redisClient.evalsha(keys['lottery_bingo_sy'], 0, (err, result) => {

        if (err) {
            console.log('開獎 Lottery (SY)');
            console.log(err);
        }

        if (result)
            (!err) && callback && callback(result.toString());
        else
            (!err) && callback && callback();
    });
}

// 設定待開獎 Lottery (SY)
helper.setLotteryWaitSy = (no) => {

    redisClient.evalsha(keys['set_lottery_wait_sy'], 0, no, (err) => {

        if (err) {
            console.log('設定待開獎 Lottery (SY)');
            console.log(no);
            console.log(err);
        }
    });
}

// 取得待開獎 Lottery (SY)
helper.getLotteryWaitSy = (callback) => {

    redisClient.evalsha(keys['get_lottery_wait_sy'], 0, (err, result) => {

        if (err) {
            console.log('取得待開獎 Lottery (SY)');
            console.log(err);
        }

        (!err) && result && callback && callback(result.toString());
    });
}

// 設定 Lottery
helper.setLotterySy = (param) => {

    redisClient.evalsha(keys['set_lottery_sy'], 0, param.name, param.no, param.number, param.dateline, (err) => {

        if (err) {
            console.log('設定 Lottery');
            console.log(param);
            console.log(err);
        }
    });
}

//==============================================================================

//==============================================================================

// 開獎 Lottery (Wn)
helper.lotteryBingoWn = (callback) => {

    redisClient.evalsha(keys['lottery_bingo_wn'], 0, (err, result) => {

        if (err) {
            console.log('開獎 Lottery (Wn)');
            console.log(err);
        }

        if (result)
            (!err) && callback && callback(result.toString());
        else
            (!err) && callback && callback();
    });
}

// 設定待開獎 Lottery (Wn)
helper.setLotteryWaitWn = (no) => {

    redisClient.evalsha(keys['set_lottery_wait_wn'], 0, no, (err) => {

        if (err) {
            console.log('設定待開獎 Lottery (Wn)');
            console.log(no);
            console.log(err);
        }
    });
}

// 取得待開獎 Lottery (Wn)
helper.getLotteryWaitWn = (callback) => {

    redisClient.evalsha(keys['get_lottery_wait_wn'], 0, (err, result) => {

        if (err) {
            console.log('取得待開獎 Lottery (Wn)');
            console.log(err);
        }

        (!err) && result && callback && callback(result.toString());
    });
}

// 設定 Lottery
helper.setLotteryWn = (param) => {

    redisClient.evalsha(keys['set_lottery_wn'], 0, param.name, param.no, param.number, param.dateline, (err) => {

        if (err) {
            console.log('設定 Lottery');
            console.log(param);
            console.log(err);
        }
    });
}

//==============================================================================
module.exports = helper;