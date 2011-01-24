var parser   = require(__dirname+"/../lib/parser.js").parser.parse;
var compiler = require(__dirname+"/../lib/compiler.js").compiler;
var _ = require("./vendor/underscore");
var vm = require("vm");

function Bluemold(input, data, templateName){
  try {
    var parsed   = parser(input);
        compiled = compiler(parsed);

    _.extend(this,data);
    this._ = _;
    this.Bluemold = Bluemold;
    this.BluemoldBlockCount = 0;
    this.block = function(fn){
      BluemoldBlockCount += 1;
      return fn();
    }
    return vm.runInThisContext("try{"+compiled+"}catch(e){throw e}", "template.js")
  } catch (e) {
    e.source   = input;
    e.parsed   = parsed;
    e.block    = this.BluemoldBlockCount;
    e.template = templateName;
    return e;
  }
}

exports.Bluemold = Bluemold;
