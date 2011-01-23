var parser   = require(__dirname+"/../lib/parser.js").parser.parse;
var compiler = require(__dirname+"/../lib/compiler.js").compiler;

exports.Bluemold = function(input, data){ return compiler(parser(input.replace(/\n|\r/ig,"\\n")),data);};
