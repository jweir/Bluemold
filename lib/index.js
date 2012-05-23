var bluemold = require('./bluemold');

module.exports               = bluemold;
module.exports.sandbox       = bluemold.sandbox;
module.exports.decorateError = bluemold.decorateError;
module.exports.send          = require('./process');
