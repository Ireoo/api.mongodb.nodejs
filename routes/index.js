var basic    = require('../lib/basic');
var colors   = require("colors");
var mongojs  = require('mongojs');

/**
 * 获取mongodb数据库参数
 */
var port     = process.env.MONGODB_PORT_27017_TCP_PORT || 27017;
var addr     = process.env.MONGODB_PORT_27017_TCP_ADDR || 'localhost';
var instance = process.env.MONGODB_INSTANCE_NAME || 'api';
var password = process.env.MONGODB_PASSWORD || '';
var username = process.env.MONGODB_USERNAME || '';

/**
 * 设置mongodb数据库连接
 * @type {mongojs}
 */
var mongodb;
if(username === '' && password === '') {
    mongodb  = mongojs(addr + ':' + port + '/' + instance);
} else {
    mongodb  = mongojs(username + ':' + password +'@' + addr + ':' + port + '/' + instance);
}

/**
 * 初始化颜色主题
 */
colors.setTheme({
    silly   : 'rainbow',
    input   : 'grey',
    verbose : 'cyan',
    prompt  : 'grey',
    info    : 'green',
    data    : 'blue',
    help    : 'cyan',
    warn    : 'yellow',
    debug   : 'blue',
    error   : 'red'
});

/**
 * 当用户访问首页时
 * @param req
 * @param res
 * @param next
 */
exports.index = function(req, res, next) {
    res.send("Welcome to QIYI api.");
};

/**
 * 用户已数据流形式访问页面/:key/:mode并提交参数
 * @param req
 * @param res
 * @param next
 */
exports.mongoDB = function(req, res, next) {
    /**
     * 切换到 {req.params.key} 数据表
     */
    var db = eval("mongodb." + req.params.key);

    /**
     * 格式化数据流数据为JSON格式
     * @type {{}}
     */
    var input = JSON.parse(req.input);

    /**
     * 调试输出获取的数据流信息
     */
    console.log("[input]  --> ".info + JSON.stringify(input).input);

    /**
     * 格式化数据流里各项参数where, data, other为JSON格式
     * @type {{}}
     */
    var where = JSON.stringify(input.where) == '[]' || !input.where ? {} : input.where;
    var data  = JSON.stringify(input.data) == '[]'  || !input.data  ? {} : input.data;
    var other = JSON.stringify(input.other) == '[]' || !input.other ? {} : input.other;

    /**
     * 主体程序入口处
     */
    switch (req.params.mode) {
        /**
         * 执行插入命令
         */
        case 'insert':
            db.insert(data, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        /**
         * 执行查找命令
         */
        case 'find':
            var sort  = JSON.stringify(other.sort) == '[]' || !other.sort ? {} : other.sort,
                skip  = other.skip || 0,
                limit = other.limit || 20;

            db.find(where).skip(skip).limit(limit).sort(sort, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        /**
         * 执行查找一条数据命令
         */
        case 'findone':
            db.findOne(where, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        /**
         * 执行修改数据命令
         */
        case 'update':
            db.update(where, data, other, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        /**
         * 执行删除命令
         */
        case 'remove':
            db.remove(where, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        /**
         * 获取该表状态信息
         */
        case 'stats':
            db.stats(function (err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        /**
         * 获取指定条件下数据量
         */
        case 'count':
            db.count(where, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result.toString());
            });
            break;

        /**
         * 创建索引
         */
        case 'createIndex':
            db.ensureIndex(where, other, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        /**
         * 重建索引
         */
        case 'reIndex':
            db.reIndex(function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        /**
         * 删除指定索引
         */
        case 'dropIndex':
            db.dropIndex(where.index, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        /**
         * 删除全部索引
         */
        case 'dropIndexes':
            db.dropIndexes(function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        /**
         * 获取索引信息
         */
        case 'getIndexes':
            db.getIndexes(function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        /**
         * 当不存在该指令时返回404
         */
        default:
            console.log("[output] --> ".info + ("MODE[" + req.params.mode + "] no find!").error);
            res.status(404).send("404 NOT FOUND!");
            break;
    }

};