var parser   = require(__dirname+"/../lib/parser.js").parser.parse;
var compiler = require(__dirname+"/../lib/compiler.js").compiler;

function Bluemold(input, data){
  return compiler(parser(input),data);
}

exports.Bluemold = Bluemold;
