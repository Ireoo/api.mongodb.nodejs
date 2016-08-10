
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

var mongodb  = "localhost/ireoo";

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

exports.index = function(req, res, next) {
    res.send("Welcome to QIYI api.");
};

exports.stats = function(req, res, next) {
    var db = eval("mongojs(mongodb, ['" + req.params.key + "'])." + req.params.key);

    db.stats(function (err, result) {
        res.send(result);
    });
};

exports.edit = function(req, res) {
    var db = eval("mongojs('" + mongodb + "', ['" + req.params.key + "'])." + req.params.key);
    var input = JSON.parse(req.input);
    console.log("[input]  --> ".info + JSON.stringify(input).input);
    // console.log("mongojs('" + mongodb + "', ['" + req.params.key + "'])." + req.params.key);
    // console.log(db);

    var where = JSON.stringify(input.where)=='[]' || !input.where ? {} : input.where;
    var data  = JSON.stringify(input.data)=='[]' || !input.data ? {} : input.data;
    var other = JSON.stringify(input.other)=='[]' || !input.other ? {} : input.other;

    switch (req.params.mode) {
        case 'insert':
            db.insert(data, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        case 'find':
            db.find(where).sort(other, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        case 'findone':
            db.findOne(where, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        case 'update':
            db.update(where, {$set: data}, other, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        case 'plus':
            db.update(where, {$inc: data}, other, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        case 'remove':
            db.remove(data, other, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        case 'stats':
            db.stats(function (err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result);
            });
            break;

        case 'count':
            db.count(where, function(err, result) {
                console.log("[output] --> ".info + (err ? JSON.stringify(err).error : JSON.stringify(result).data));
                res.send(err ? err : result.toString());
            });
            break;

        default:
            res.send("404 NOT FOUND");
            break;
    }

};