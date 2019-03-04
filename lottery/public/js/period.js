var vm = new Vue({
    el: '#app',
    data: {
        game: '',
        dateList: [],
        periodList: [],
        currentOption: ''
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

            fetch(`/period/getDate`, {
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

            fetch(`/period/getPeriod`, {
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
        }
    }
})