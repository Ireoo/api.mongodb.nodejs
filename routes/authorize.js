const router = require("express").Router();

exports = module.exports = router;

router.auth = false;
// router.path = "/";

router.all("/", (req, res, next) => {
	console.log(req.body, req.params, req.query, req.data);
	let app = req.data;

	if (app.id && app.secret) {
		res.send({
			success: true
		});
	} else {
		res.send({
			success: false
		});
	}
});
