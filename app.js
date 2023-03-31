var createError = require('http-errors');
var express = require('express')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var moment = require('moment');
const bodyParser = require('body-parser');
const cors = require("cors");

require('console-stamp')(console, {
    formatter: function() {
        return moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
    }
});

const whitelist = ['http://information.lgcns.com', 'https://connect.lgcns.com'];
const corsOptons = {
	origin : function (origin, cb){
		if(whitelist.indexOf(origin) !== -1){
			console.log(`cors: ${origin} >> pass`);
			cb(null, true);
		}else{
			console.log(`cors: ${origin} >> false`);
			cb(new Error("not allow origin Error..."))
		}
	},
	credential: true
}

let app = express();

const cns_fileUpload = require('./routes/fileUpload');

//var module_files = path.join(process.cwd(), '../modules');
app.use(methodOverride('_method'));
//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/modules', express.static(module_files));

app.use(cors(corsOptons));
app.use(bodyParser.json({limit: '50mb'})); //body 의 크기 설정
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); //url의 크기 설정
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/pre', cns_webinar_preregist);
app.use('/fileUpload', cns_fileUpload);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.json({ errorMessage: err.message })
});

module.exports = app;
