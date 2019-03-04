module.exports = {
    cookieSecret: 'center',
    web: {
        port: 80
    },
    db: {
        name: '',
        username: '',
        password: '',
        host: '', 
        port: 3306,
    },
    redis: {
        port: 6379,
        host: '127.0.0.1',
        password: 'Sst23211896',
    },
    tick: {
        lotteryC1: '3s',
        lotteryC2: '3s',
        lotteryC3: '3s',
        lotteryCt: '6s',        
        lotteryRc: '6s',
        lotteryPe: '6s',
        lotteryPk: '6s',
        lotterySy: '6s',
        lotteryWn: '6s',
        routineCheck: '300s',
        lotterySelfCheck: '20s',

    },
};