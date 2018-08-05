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

	// if (r.auth) {
	// 	if (r.post) {
	// 		router.post(r.path ? r.path : file.replace(/^auth|.js/g, ""), auth, r.post);
	// 		console.log(`[POST] <auth>`, r.path ? r.path : file.replace(/^auth|.js/g, ""), `/routes${file}`, `Loaded!`);
	// 	}
	// 	if (r.put) {
	// 		router.put(r.path ? r.path : file.replace(/^auth|.js/g, ""), auth, r.put);
	// 		console.log(`[PUT] <auth>`, r.path ? r.path : file.replace(/^auth|.js/g, ""), `/routes${file}`, `Loaded!`);
	// 	}
	// 	if (r.get) {
	// 		router.get(r.path ? r.path : file.replace(/^auth|.js/g, ""), auth, r.get);
	// 		console.log(`[GET] <auth>`, r.path ? r.path : file.replace(/^auth|.js/g, ""), `/routes${file}`, `Loaded!`);
	// 	}
	// 	if (r.delete) {
	// 		router.delete(r.path ? r.path : file.replace(/^auth|.js/g, ""), auth, r.delete);
	// 		console.log(
	// 			`[DELETE] <auth>`,
	// 			r.path ? r.path : file.replace(/^auth|.js/g, ""),
	// 			`/routes${file}`,
	// 			`Loaded!`
	// 		);
	// 	}
	// 	if (r.options) {
	// 		router.options(r.path ? r.path : file.replace(/^auth|.js/g, ""), auth, r.options);
	// 		console.log(
	// 			`[OPTIONS] <auth>`,
	// 			r.path ? r.path : file.replace(/^auth|.js/g, ""),
	// 			`/routes${file}`,
	// 			`Loaded!`
	// 		);
	// 	}
	// 	if (r.all) {
	// 		router.all(r.path ? r.path : file.replace(/^auth|.js/g, ""), auth, r.all);
	// 		console.log(`[ALL] <auth>`, r.path ? r.path : file.replace(/^auth|.js/g, ""), `/routes${file}`, `Loaded!`);
	// 	}
	// } else {
	// 	if (r.post) {
	// 		router.post(r.path ? r.path : file.replace(/^auth|.js/g, ""), r.post);
	// 		console.log(
	// 			`[POST] <no auth>`,
	// 			r.path ? r.path : file.replace(/^auth|.js/g, ""),
	// 			`/routes${file}`,
	// 			`Loaded!`
	// 		);
	// 	}
	// 	if (r.put) {
	// 		router.put(r.path ? r.path : file.replace(/^auth|.js/g, ""), r.put);
	// 		console.log(
	// 			`[PUT] <no auth>`,
	// 			r.path ? r.path : file.replace(/^auth|.js/g, ""),
	// 			`/routes${file}`,
	// 			`Loaded!`
	// 		);
	// 	}
	// 	if (r.get) {
	// 		router.get(r.path ? r.path : file.replace(/^auth|.js/g, ""), r.get);
	// 		console.log(
	// 			`[GET] <no auth>`,
	// 			r.path ? r.path : file.replace(/^auth|.js/g, ""),
	// 			`/routes${file}`,
	// 			`Loaded!`
	// 		);
	// 	}
	// 	if (r.delete) {
	// 		router.delete(r.path ? r.path : file.replace(/^auth|.js/g, ""), r.delete);
	// 		console.log(
	// 			`[DELETE] <no auth>`,
	// 			r.path ? r.path : file.replace(/^auth|.js/g, ""),
	// 			`/routes${file}`,
	// 			`Loaded!`
	// 		);
	// 	}
	// 	if (r.options) {
	// 		router.options(r.path ? r.path : file.replace(/^auth|.js/g, ""), r.options);
	// 		console.log(
	// 			`[OPTIONS] <no auth>`,
	// 			r.path ? r.path : file.replace(/^auth|.js/g, ""),
	// 			`/routes${file}`,
	// 			`Loaded!`
	// 		);
	// 	}
	// 	if (r.all) {
	// 		router.all(r.path ? r.path : file.replace(/^auth|.js/g, ""), r.all);
	// 		console.log(
	// 			`[ALL] <no auth>`,
	// 			r.path ? r.path : file.replace(/^auth|.js/g, ""),
	// 			`/routes${file}`,
	// 			`Loaded!`
	// 		);
	// 	}
	// }
});

// let noauth_dirs = readDirs(path.join(__dirname, '../routes'), "/noauth");
// console.log(noauth_dirs);
// noauth_dirs.forEach(file => {
//     console.log(`/api${file.replace(/^noauth|.js/g, "")}`, `./${file}`);
//     router.use(file.replace(/^noauth|.js/g, ""), require(`./${file}`));
// });

exports = module.exports = router;
