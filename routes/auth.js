const router = require("express").Router();

exports = module.exports = router;

router.auth = true;
// router.path = "/";

router.all("/", (req, res, next) => {
	let app = req.body;

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
