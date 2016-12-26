/**
 * Created by S2 on 15/7/7.
 */
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var logger     = require('morgan');
var routes     = require('./routes');

/**
 * 显示访问信息
 */
app.use(logger('dev')); //combined'));

/**
 * 获取数据流并保存在req.input里面
 */
app.use(function(req, res, next){
    var reqData = [];
    var size = 0;
    req.on('data', function (data) {
        // console.log('>>>req on');
        reqData.push(data);
        size += data.length;
    });
    req.on('end', function () {
        // console.log('>>>req end');
        req.input = Buffer.concat(reqData, size);
    });
    next();
});

/**
 * 处理数据流成POST数据
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * 设置默认网页路径，并设置网页后缀
 */
app.set('views', require('path').join(__dirname, 'www'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

/**
 * 设置include文件的路径
 */
app.use(express.static(__dirname + '/include'));

/**
 * 全局处理，比如验证key等信息
 */
// app.use(function(req, res, next) {
//     console.log('%s http://%s%s', req.method, req.headers.host, req.url);
//     console.log(req.headers);
//     console.log(basic.getIP(req));
//     next();
// });

/**
 * 路由规则
 */
app.get('/', routes.index);
app.post('/', routes.index);

app.post('/:key/:mode', function(req, res, next) {
    /**
     * 格式化数据流数据为JSON格式
     * @type {{}}
     */
    var input = JSON.parse(req.input);
    if(input.key == 'ireoo') {
        next();
    } else {
        res.status(404).send("授权失败!请勿越权使用!");
    }
});
app.post('/:key/:mode', routes.mongoDB);

/**
 * 设置服务器端口为80
 */
var server = app.listen(80, function() {
    console.log('Listening on port %d', server.address().port);
});
