let path = require('path');

let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let config = require('./config/config');

let app = express();

app.set('port', process.env.PORT || config.web.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());
app.use(session({
    secret: config.cookieSecret,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    },
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

require('./routes/lottery_routes')(app);
require('./routes/period_routes')(app);

let server = app.listen(app.get('port'), function () {

    require('./helpers/timer_lottery_c1_helper').init();
    require('./helpers/timer_lottery_c2_helper').init();
    require('./helpers/timer_lottery_c3_helper').init();
    require('./helpers/timer_lottery_ct_helper').init();
    require('./helpers/timer_lottery_rc_helper').init();
    require('./helpers/timer_lottery_pe_helper').init();
    require('./helpers/timer_lottery_pk_helper').init();
    require('./helpers/timer_lottery_sy_helper').init();
    require('./helpers/timer_lottery_wn_helper').init();
    require('./helpers/check_self_lottery_helper').routineCheck();
    require('./helpers/check_lottery_helper').routineCheck();
    console.log(Date());
});