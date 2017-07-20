/**
 * Created by S2 on 15/7/7.
 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const logger = require('morgan');
const routes = require('./routes');
const config = require('./config') || {};
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
 * 获取数据流并保存在req.input里面
 */
app.use(function (req, res, next) {
    let reqData = [];
    let size = 0;
    req.on('data', (data) => {
        // console.log('>>>req on');
        reqData.push(data);
        size += data.length;
    });
    req.on('end', () => {
        // console.log('>>>req end');
        // console.log(Buffer.concat(reqData, size));
        req.input = JSON.parse(Buffer.concat(reqData, size).toString() === '' ? "{}" : Buffer.concat(reqData, size));
    });
    next();
});

/**
 * 处理数据流成POST数据
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.all('/:key/:mode', (req, res, next) => {
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
app.all('/:key/:mode', routes.mongoDB);

/**
 * 设置服务器端口为2012
 */
const server = app.listen(config.port, () => {
    console.log('Listening on port %s:%d', server.address().address, server.address().port);
});


