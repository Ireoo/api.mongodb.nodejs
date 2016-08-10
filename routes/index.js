
/*
 * GET home page.
 */

var basic  = require('../lib/basic');
// var db     = require('../lib/db');
var colors = require("colors");

var mongojs = require('mongojs');

var port     = process.env.MONGODB_PORT_27017_TCP_PORT;
var addr     = process.env.MONGODB_PORT_27017_TCP_ADDR;
var instance = process.env.MONGODB_INSTANCE_NAME;
var password = process.env.MONGODB_PASSWORD;
var username = process.env.MONGODB_USERNAME;

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

exports.index = function(req, res) {
    // res.render('index', { title: '琦益' });
    var db = mongojs(username + ':' + password +'@' + addr + ':' + port + '/' + instance, ['news']);
    db.news.count({}, function(err, result){
        res.send(result.toString());
    });
};

exports.count = function(req, res) {
    var db = mongojs(username + ':' + password +'@' + addr + ':' + port + '/' + instance, ['news']);
    db.news.count({}, function(err, result){
        res.send(result.toString());
    });
};

exports.stats = function(req, res) {
    var db = mongojs(username + ':' + password +'@' + addr + ':' + port + '/' + instance, ['news']);
    db.news.stats(function(err, result){
        res.send(result);
    });
};