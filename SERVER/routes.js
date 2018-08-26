const auth = require("./auth");

const fs = require("fs");
const path = require("path");

const express = require("express");
const router = express.Router();

// router.use('/', (req, res, next) => {
//     console.log(req);
//     next();
// });

const readDirs = (dir, _path = "/") => {
	// console.log(path.join(dir, _path));
	let auth_dirs = fs.readdirSync(path.join(dir, _path));
	let dirs = [];
	auth_dirs.forEach(file => {
		let stat = fs.statSync(path.join(dir, _path, file));
		if (stat.isDirectory()) {
			let d = readDirs(dir, `${_path}/${file}`);
			d.forEach(v => {
				dirs.push(v);
			});
		} else {
			dirs.push(`${_path}/${file}`);
		}
	});
	return dirs;
};

// 动态加载路由规则
let auth_dirs = readDirs(path.join(__dirname, "../routes"), "");
// console.log(auth_dirs);
auth_dirs.forEach(file => {
	let r = require(path.join(__dirname, "../routes", `${file}`));

	if (r.auth) {
		router.use(r.path ? r.path : file.replace(/^auth|.js/g, ""), auth, r);
		console.log(`[ROUTER] <auth>`, r.path ? r.path : file.replace(/^auth|.js/g, ""), `/routes${file}`, `Loaded!`);
	} else {
		router.use(r.path ? r.path : file.replace(/^auth|.js/g, ""), r);
		console.log(`[ROUTER] <noauth>`, r.path ? r.path : file.replace(/^auth|.js/g, ""), `/routes${file}`, `Loaded!`);
	}
});

exports = module.exports = router;
