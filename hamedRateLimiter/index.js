const cache = [];
var options = {};

options.interval = 30;
options.rateLimit = 100;
options.limiterKey = function(req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip;
}

module.exports = function (overrideOptions) {
    options = {...options, ...overrideOptions};
    return async function (req, res, next) {
        console.log(options);
        const r = await isRequestBlocked(options, req);
        if (r === false) {
            next();
        }else{
            return res.status(429).send({
                message: 'Rate limit exceeded. Try again in ' + r + ' seconds'
            });
        }
    }
}

function isRequestBlocked(options, req) {
    const key = options.limiterKey(req);
    if (!(cache[key])) {
        cache[key] = [];
    }
    const bucket = cache[key];
    const currentTimestamp = getCurrentTimestamp();

    console.log(cache);

    const newBucket = [];
    for (const item of bucket) {
        if (item.timestamp >= currentTimestamp - options.interval) {
            // this item is not old and should keep it. otherwise, forget the item
            newBucket.push(item);
        }
    }
    cache[key] = newBucket;

    if (newBucket.length >= options.rateLimit) {
        // Reached the limit, we return the time required to unblock
        return newBucket[0].timestamp - currentTimestamp + options.interval + 1;
    }

    newBucket.push({timestamp: currentTimestamp});
    return false;
}

function getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000);
}