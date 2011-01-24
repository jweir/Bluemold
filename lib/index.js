var parser   = require(__dirname+"/../lib/parser.js").parser.parse;
var compiler = require(__dirname+"/../lib/compiler.js").compiler;
var _        = require("./vendor/underscore");
var vm       = require("vm");

function Bluemold(input, data, templateName){
  try {
    this.parsed = parser(input);
  } catch (e) {
    return e;
  }

  try {
    this.compiled = compiler(parsed);

    _.extend(this,data);
    this._ = _;
    this.Bluemold = Bluemold;

    return vm.runInThisContext("try{"+this.compiled+"}catch(e){throw e}", "BlueMoldTemplate");

  } catch (e) {
    e.source   = input;
    e.template = templateName;
    if(e.stack){
      var stack = e.stack.split(/\n/ig)[1];
      e.lineNumber = (this.compiled.substr(0, stack.match(/\d+$/)[0]).match(/\\n/ig) || []).length+1;
    }
    return e;
  }
}

exports.Bluemold = Bluemold;
