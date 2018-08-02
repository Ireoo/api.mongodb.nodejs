const mongojs = require("../lib/mongojs");

/**
 * 获取mongodb数据库参数
 */
const connect = process.env.MONGODB || "127.0.0.1:27017/api";

/**
 * 设置mongodb数据库连接
 * @type {mongojs}
 */
let mongodb = mongojs(connect);

/**
 * 初始化颜色主题
 */
const colors = require("colors");
colors.setTheme({
	silly: "rainbow",
	input: "grey",
	verbose: "cyan",
	prompt: "grey",
	info: "green",
	data: "blue",
	help: "cyan",
	warn: "yellow",
	debug: "blue",
	error: "red"
});

exports = module.exports = {
	auth: true,
	path: "/:table/:mode",
	post: (req, res, next) => {
		// console.log(req);
		/**
		 * 切换到 {req.params.key} 数据表
		 */
		let db = eval("mongodb." + req.params.table);
		// let db = mongojs(connect, [req.params.table]);

		// db.on('error', (err) => {
		//     res.send({
		//         error
		//     })
		// })

		// db.on('connect', () => {
		//     console.log('database connected');

		/**
		 * 格式化数据流数据为JSON格式
		 * @type {{}}
		 */
		let input = req.data;

		/**
		 * 调试输出获取的数据流信息
		 */
		console.log("[input]  --> ".info + JSON.stringify(input).input);

		/**
		 * 格式化数据流里各项参数where, data, other为JSON格式
		 * @type {{}}
		 */
		let where = JSON.stringify(input.where) === "[]" || !input.where ? {} : input.where;
		let data = JSON.stringify(input.data) === "[]" || !input.data ? {} : input.data;
		let other = JSON.stringify(input.other) === "[]" || !input.other ? {} : input.other;

		if (where.hasOwnProperty("_id") && where._id !== "") {
			where._id = mongojs.ObjectId(where._id);
		}

		// 定义变量
		let sort, show, skip, limit, sql, dis;

		/**
		 * 主体程序入口处
		 */
		switch (req.params.mode) {
			/**
			 * 执行插入命令
			 */
			case "insert":
				db.insert(data, (error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 执行查找命令
			 */
			case "find":
				sort = JSON.stringify(other.sort) === "[]" || !other.sort ? {} : other.sort;
				show = JSON.stringify(other.show) === "[]" || !other.show ? {} : other.show;
				skip = other.skip || 0;
				limit = other.limit || 0;

				if (limit == 0) {
					sql = db.find(where, show);
				} else {
					sql = db
						.find(where, show)
						.skip(skip)
						.limit(limit);
				}
				sql.sort(sort, (error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 执行查找一条数据命令
			 */
			case "findone":
				show = JSON.stringify(other.show) === "[]" || !other.show ? {} : other.show;
				db.findOne(where, show, (error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 执行聚合查询命令
			 */
			case "distinct":
				dis = JSON.stringify(other.distinct) === "[]" || !other.distinct ? "" : other.distinct;
				db.distinct(dis, where, (error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 执行修改数据命令
			 */
			case "update":
				db.update(where, data, other, (error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 执行删除命令
			 */
			case "remove":
				db.remove(where, (error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 删除该数据库
			 */
			case "drop":
				db.drop((error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 获取该表状态信息
			 */
			case "stats":
				db.stats((error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 获取指定条件下数据量
			 */
			case "count":
				db.count(where, (error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 创建索引
			 */
			case "createIndex":
				db.ensureIndex(where, other, (error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 重建索引
			 */
			case "reIndex":
				db.reIndex((error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 删除指定索引
			 */
			case "dropIndex":
				db.dropIndex(where.index, (error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 删除全部索引
			 */
			case "dropIndexes":
				db.dropIndexes((error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 获取索引信息
			 */
			case "getIndexes":
				db.getIndexes((error, data) => {
					console.log(
						"[output] --> ".info + (error ? JSON.stringify(error).error : JSON.stringify(data).data)
					);
					res.send({
						error,
						data
					});
				});
				break;

			/**
			 * 当不存在该指令时返回404
			 */
			default:
				console.log("[output] --> ".info + ("MODE[" + req.params.mode + "] no find!").error);
				res.send({
					error: `MODE[${req.params.mode}] no found!`
				});
				break;
		}
		// })
	}
};
