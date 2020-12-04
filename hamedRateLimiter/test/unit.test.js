const assert = require('assert');
const hamedRateLimiter = require('hamedRateLimiter');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

describe('Test RateLimiter', () => {
    options = {
        interval: 1,
        rateLimit: 2,
        limiterKey: function(req) {
            return req.ip;
        }
    };
    var rateLimiter = hamedRateLimiter(options);

    var mockReq = { ip : '192.168.0.1' };
    var mockRes = {};
    var statusCode = 0;
    mockRes.status = function(code) {
        statusCode = code;
        return this;
    };
    mockRes.send = function (msg) {
        mockRes.msg = msg;
        return this;
    };
    nextCalled = false;
    var mockNext = function () {
        nextCalled = true;
    };

    it('Interval should equal 1', () => {
        assert.equal(hamedRateLimiter.getOptions().interval, 1);
    });

    it('rateLimit should equal 2', () => {
        assert.equal(hamedRateLimiter.getOptions().rateLimit, 2);
    });

    it('limiterKey should equal 192.168.0.1', () => {
        assert.equal(hamedRateLimiter.getOptions().limiterKey(mockReq), '192.168.0.1');
    });

    it('First call should be passed', async () => {
        nextCalled = false;
        await rateLimiter(mockReq, mockRes, mockNext);
        assert.equal(nextCalled, true);
    });

    it('Second call should be passed', async () => {
        nextCalled = false;
        await rateLimiter(mockReq, mockRes, mockNext);
        assert.equal(nextCalled, true);
    });

    it('Third call should be blocked with 429 error', async () => {
        nextCalled = false;
        await rateLimiter(mockReq, mockRes, mockNext);
        assert.equal(nextCalled, false);
        assert.equal(statusCode, 429);
    });

    it('4th call should be passed after we wait 1.1 seconds', async () => {
        nextCalled = false;
        await timeout(1100);
        await rateLimiter(mockReq, mockRes, mockNext);
        assert.equal(nextCalled, true);
    });

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
});