Hamed Rate Limiter (Airtasker Programming Challenge)
====

Setup
---
After cloning from git, run the following command to install required modules.
```
npm install
```

Run the project
---
Use the following command to run the project:
```
npm start
```

Custom strategies
---
In order to enforce your custom strategy, you can easily call the middleware with the following options:
* interval: integer value that defines the interval between requests in seconds (Default: 3600)
* rateLimit: number of requests the user is allowed to make during the interval (Default: 100)
* limiterKey: The function that returns the key for the limiter (Default: request's ip address)

Example usage
---
Simple:
```
app.use(hamedRateLimiter());
```
Options:
```
app.use(hamedRateLimiter({
	interval: 5,
	rateLimit: 2,
	limiterKey: function(req) {
		return req.headers.authorization; // Rate limiting based on authorization key
	}
}));
```

Tests
---
The folder `hamedRateLimiter` includes the middleware. In order to run tests on this middleware, you must install `mocha`.
```
sudo npm install -g mocha
```
In order to run tests, run the following command inside `hamedRateLimiter` directory.
```
npm run test
```

Structure
---
The project is consists of a `index.js` file in the root directory. It is a sample project created using `Express.js` and it uses `HamedRateLimiter` middleware.
The middleware is created 