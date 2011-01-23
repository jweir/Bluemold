var parser   = require(__dirname+"/../lib/parser.js").parser.parse;
var compiler = require(__dirname+"/../lib/compiler.js").compiler;
var _ = require("./vendor/underscore");

function Bluemold(input, data){
  try {
    var parsed   = parser(input);
        compiled = compiler(parsed);

    _.extend(this,data);
    this._ = _;
    this.Bluemold = Bluemold;

    return (new Function("return "+compiled))();
  } catch (e) {
    return e;
  }
}

exports.Bluemold = Bluemold;
