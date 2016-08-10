/**
 * Created by S2 on 15/7/7.
 */
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var routes     = require('./routes');

//处理post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// view engine setup
app.set('views', require('path').join(__dirname, 'www'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

// app.use(app.router);
app.use(express.static(__dirname + '/include'));

//app.use(function(req, res, next) {
//    console.log('%s http://%s%s', req.method, req.headers.host, req.url);
//    console.log(req.headers);
//    console.log(basic.getIP(req));
//    if(basic.getIP(req) != '115.29.190.77' && basic.getIP(req) != '121.43.106.166') {
//       console.log('拦截IP：%s 的访问！', basic.getIP(req));
//       res.send("未授权用户，无法访问!");
//    }else{
//       next();
//    }
//});

//主体
app.get('/', routes.index);
app.get('/count', routes.count);
app.get('/stats', routes.stats);
// app.get('/:key', routes.list);
// app.get('/:key/:id', routes.info);
// app.post('/:key/:type', routes.edit);

var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
});