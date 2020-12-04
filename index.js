const express = require('express');
const app = express();
const port = 3000;
const hamedRateLimiter = require('hamedRateLimiter');

app.use(hamedRateLimiter({
	interval: 5,
	rateLimit: 2,
	limiterKey: function(req) {
		return req.ip;
	}
}));

app.get('/', (req, res) => {
	res.send('Hello! This is the main API which is controlled by a customer rate limiter.');
});

app.listen(port, () => {
	console.log(`Airtasker app listening at http://localhost:${port}`);
});
