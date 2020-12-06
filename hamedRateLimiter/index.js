const cache = require('./cache');

var options = {};

options.interval = 3600;
options.rateLimit = 100;
options.limiterKey = function(req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return ip;
}

module.exports = function (overrideOptions) {
    options = {...options, ...overrideOptions};
    return async function (req, res, next) {
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

module.exports.getOptions = function () {
    return options;
}

function isRequestBlocked(options, req) {
    const key = options.limiterKey(req);
    if (!(cache.getItem(key))) {
        cache.setItem(key, []);
    }
    const bucket = cache.getItem(key);
    const currentTimestamp = getCurrentTimestamp();

    const newBucket = [];
    for (const item of bucket) {
        if (item.timestamp >= currentTimestamp - options.interval * 1000) {
            // this item is not old and should keep it. otherwise, forget the item
            newBucket.push(item);
        }
    }
    cache.setItem(key, newBucket);

    if (newBucket.length >= options.rateLimit) {
        // Reached the limit, we return the time required to unblock
         return Math.ceil((newBucket[0].timestamp - currentTimestamp + options.interval * 1000) / 1000);
    }

    newBucket.push({timestamp: currentTimestamp});
    return false;
}

function getCurrentTimestamp() {
    return Math.floor(Date.now());
}