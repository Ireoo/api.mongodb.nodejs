/**
 * Created by S2 on 15/7/7.
 */
const express = require('express');
const app = express();
const logger = require('morgan');
const routes = require('./routes');
const config = require('./config') || {host: process.env.HOST || '', port: process.env.PORT || 80, key: process.env.KEY || 'test'};
const compression = require('compression');

/**
 * 显示访问信息
 */
app.use(logger('[:date[iso]] :remote-addr[:remote-user] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'));

/**
 * 添加gzip
 */
app.use(compression());

/**
 * 允许跨域访问
 */
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

/**
 * 获取数据流并保存在req.input里面
 */
app.use(function (req, res, next) {
    let reqData = [];
    let size = 0;
    req.on('data', (data) => {
        reqData.push(data);
        size += data.length;
    });
    req.on('end', () => {
        req.input = JSON.parse(Buffer.concat(reqData, size).toString() === '' ? "{}" : Buffer.concat(reqData, size));
        next();
    });
});

/**
 * 处理数据流成POST数据
 */
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

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
app.use((req, res, next) => {
    if (config && config.host && config.host !== '') {
        if (req.headers.host === config.host) {
            next();
        } else {
            res.status(404).send('NOT FOUND!!!');
        }
    } else {
        next();
    }
    //     console.log('%s http://%s%s', req.method, req.headers.host, req.url);
    //     console.log(req.headers);
    //     console.log(basic.getIP(req));
    //     next();
});

/**
 * 路由规则
 */
app.all('/', routes.index);

app.all(/^\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)$/, (req, res, next) => {
    console.log(req.input);
    /**
     * 格式化数据流数据为JSON格式
     * @type {{}}
     */
    if (req.input.key === config.key) {
        next();
    } else {
        res.status(404).send("授权失败!请勿越权使用!");
    }
});
app.all(/^\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)$/, routes.mongoDB);

/**
 * 申请ssl证书设置
 */
app.all('/.well-known/acme-challenge/(.*)', (req, res, next) => {
    res.status(200).send(process.env[req.params[0]]);
});

/**
 * 设置服务器端口默认为80
 */
const server = app.listen(config.port, () => {
    console.log('Listening on port %s:%d', server.address().address, server.address().port);
});
