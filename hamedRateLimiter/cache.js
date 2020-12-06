const items = [];

module.exports.getItem = function (key) {
    return items[key];
}

module.exports.setItem = function (key, value) {
    items[key] = value;
}