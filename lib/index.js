var parser   = require(__dirname+"/../lib/parser.js").parser.parse;
var compiler = require(__dirname+"/../lib/compiler.js").compiler;
var _ = require("./vendor/underscore");
var vm = require("vm");

function Bluemold(input, data){
  try {
    var parsed   = parser(input);
        compiled = compiler(parsed);

    _.extend(this,data);
    this._ = _;
    this.Bluemold = Bluemold;
    return vm.runInThisContext("try{"+compiled+"}catch(e){throw e}", "template.js")
  } catch (e) {
    e.compiled = compiled;
    return e;
  }
}

exports.Bluemold = Bluemold;
