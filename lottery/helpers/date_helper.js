let moment = require('moment-timezone');
let helper = {};

helper.getStartOfTodayTS = (ts) => {
    return moment.unix(ts).startOf('day').format('X');
}

helper.now = () => {
    return moment().tz('Asia/Taipei').format('X');
}

helper.getDT = (ts) => {
    return moment.unix(ts).format('YYYY-MM-DD HH:mm:ss');
}

helper.getTodayD = (ts) => {
    return moment.unix(ts).format('YYYYMMDD');
}

helper.getYesterdayD = (ts) => {
    return moment.unix(ts).subtract(1, 'day').format('YYYYMMDD');
}

helper.getTomorrowD = (ts) => {
    return moment.unix(ts).add(1, 'day').format('YYYYMMDD');
}

helper.getTS = (date) => {
    return moment(date).format('X');
}

helper.getPastTS = (ts, day) => {
    return moment.unix(ts).subtract(day, 'day').format('X');
}

helper.getFutureTS = (ts, day) => {
    return moment.unix(ts).add(day, 'day').format('X');
}

helper.getNow = () => {
    return moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
}

helper.getDateToday = () => {
    return moment().tz('Asia/Taipei').format('YYYY-MM-DD');
}

helper.getDateYesterday = () => {
    return moment().tz('Asia/Taipei').subtract(1, 'day').format('YYYY-MM-DD');
}

helper.getDateYesterdayBefore = () => {
    return moment().tz('Asia/Taipei').subtract(2, 'day').format('YYYY-MM-DD');
}

helper.getDateFromDate = (date) => {
    return moment(date).tz('Asia/Taipei').format('YYYY-MM-DD');
}

helper.getDatetimeFromMysqlDatetime = (date) => {
    return moment(date).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');
}

module.exports = helper;