/**
 * Created by S2 on 15/7/7.
 */
const express = require("express");
const app = express();
const morgan = require("morgan");
const compression = require("compression");
const mongojs = require("./lib/mongojs");

/**
 * 显示访问信息
 */
app.use(
	morgan(
		'[:date[iso]] :remote-addr[:remote-user] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'
	)
);

/**
 * 添加gzip
 */
app.use(compression());

/**
 * 允许跨域访问
 */
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});

/**
 * 设置数据库
 */
app.use((req, res, next) => {
	/**
	 * 获取mongodb数据库参数
	 */
	const connect = process.env.MONGODB || "127.0.0.1:27017/api";

	/**
	 * 设置mongodb数据库连接
	 * @type {mongojs}
	 */
	req.mongodb = mongojs(connect);
	next();
});

/**
 * 获取数据流并保存在 req.data 里面
 */
app.use((req, res, next) => {
	let reqData = [];
	let size = 0;
	req.on("data", data => {
		reqData.push(data);
		size += data.length;
	});
	req.on("end", () => {
		try {
			req.data = JSON.parse(
				Buffer.concat(reqData, size).toString() === "" ? "{}" : Buffer.concat(reqData, size).toString()
			);
			next();
		} catch (error) {
			res.send({
				success: false,
				message: `提交的数据格式错误,请提交json格式的文本`,
				data: Buffer.concat(reqData, size).toString
			});
		}
	});
});

/**
 * 路由规则
 */
app.use("/", require("./SERVER/routes"));

/**
 * 设置服务器端口默认为80
 */
const server = app.listen(process.env.PORT || 2018, () => {
	console.log("Listening on port %s:%d", server.address().address, server.address().port);
});

/**
 * 处理错误
 */
process.on("uncaughtException", error => {
	console.log("Caught exception: ", error);
});
