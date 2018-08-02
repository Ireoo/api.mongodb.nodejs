const express = require("express");
const router = express.Router();
const md5 = require("md5");

exports = module.exports = router;

/**
 * 首页内容
 */
router.post("/", (req, res, next) => {
	console.log(req.body, req.params, req.query, req.data);
	// let username = req.body.username,
	// 	password = req.body.password;

	// User.findOne({
	// 	where: {
	// 		username: username,
	// 		password: md5(password)
	// 	}
	// })
	// 	.then(user => {
	// 		// console.log(user);
	// 		if (user !== null) {
	// 			req.user = user;
	// 			next();
	// 		} else {
	// 			res.status(404).send(`${username} user is not ex.`);
	// 		}
	// 	})
	// 	.catch(e => {
	// 		res.status(404).send(e);
	//     });

	next();
});
