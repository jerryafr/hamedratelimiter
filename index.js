const express = require('express');
const app = express();
const port = 3000;
const hamedRateLimiter = require('hamedRateLimiter');

app.use(hamedRateLimiter({
	interval: 5,
	rateLimit: 2,
	limiterKey: function(req) {
		console.log(req.query.test);
		return 'a'+req.query.test;
	}
}));

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
