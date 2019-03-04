var vm = new Vue({
    el: '#app',
    data: {
        game: '',
        dateList: [],
        periodList: [],
        currentOption: '',
        losePeriod: '',
        loseNumber: ''
    },
    mounted() {
        this.getGame('ct');
    },
    methods: {
        getGameType() {
            let gameType = ''
            switch (this.game) {
                case 'ct':
                case 'c1':
                case 'c2':
                case 'c3':
                    gameType = 'ct';
                    break;
                case 'rc':
                    gameType = 'rc';
                    break;
                case 'sy':
                    gameType = 'sy';
                    break;
                case 'wn':
                    gameType = 'wn';
                    break;
                case 'pe':
                    gameType = 'pe';
                    break;
                case 'pk':
                    gameType = 'pk';
                    break;
                default:
                    gameType = 'ct';

                    break;
            }
            return gameType
        },
        getGame(game) {

            this.game = game;

            let postData = {
                game: this.game
            }

            fetch(`/period/getLoseDate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                })
                .then((response) => {
                    return response.json()
                })
                .then((receive) => {
                    this.dateList = receive;

                    this.periodList.length = 0;
                    this.currentOption = '';
                })
        },
        getHistory(item) {

            this.periodList = [];
            this.currentOption = item

            let postData = {
                game: this.game,
                date: item
            }

            fetch(`/period/getLosePeriodSP`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                })
                .then((response) => {
                    return response.json()
                })
                .then((receive) => {
                    vm.periodList = receive;
                })
        },
        autoFix(period) {
            let postData = {
                game: this.game,
                period: period
            }
            fetch(`/setperiod/setLosePeriod`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                })
                .then((response) => response.json())
                .then((receive) => {
                    if (receive == 'success') {
                        vm.getHistory(this.currentOption);
                    }
                })
        },
        manualFix() {
            let postData = {
                game: this.game,
                no: this.losePeriod,
                number: this.loseNumber,
                period: this.losePeriod
            }
            let check = false;
            let numberArr = postData.number.split(',');
            switch (this.game) {
                case 'ct':
                    check = (postData.no).length == 11 && numberArr.length == 5 && numberArr.every(function (item, index, array) {
                        return item >= 0 && item <= 9 // 號碼範圍在0-9
                    })
                    break;
                case 'rc':
                    check = postData.no.length == 11 && numberArr.length == 5 && numberArr.every(function (item, index, array) {
                        return item >= 0 && item <= 9 // 號碼範圍在0-9
                    })
                    break;
                case 'sy':
                    check = postData.no.length == 10 && numberArr.length == 5 && numberArr.every(function (item, index, array) {
                        return item >= 1 && item <= 11 // 號碼範圍在1-11
                    }) && checkNoReapt(numberArr)
                    break;
                case 'wn':
                    check = postData.no.length == 11 && numberArr.length == 10 && numberArr.every(function (item, index, array) {
                        return item >= 1 && item <= 10 // 號碼範圍在1-10
                    }) && checkNoReapt(numberArr)
                    break;
                case 'pe':
                    check = postData.no.length == 6 && numberArr.length == 3 && numberArr.every(function (item, index, array) {
                        return item >= 0 && item <= 9 // 號碼範圍在0-9
                    })
                    break;
                case 'pk':
                    check = postData.no.length == 6 && numberArr.length == 10 && numberArr.every(function (item, index, array) {
                        return item >= 1 && item <= 10 // 號碼範圍在0-9
                    }) && checkNoReapt(numberArr)
                    break;
                default:

                    break;
            }
            if (check) {
                fetch(`/setperiod/setLosePeriodByArtificial`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(postData)
                    })
                    .then((response) => response.json())
                    .then((receive) => {
                        if (receive == '新增成功') {
                            vm.getHistory(this.currentOption);
                            this.loseNumber = '';
                            this.losePeriod = '';

                        }
                        alert(receive);
                    })
            } else {
                alert('輸入錯誤，請確認資料正確性');
            }
        }
    }
})

let checkNoReapt = ((arr) => {

    var hash = {};

    for (var i in arr) {

        if (hash[arr[i]])

            return false;

        hash[arr[i]] = false;

    }

    return true;

})