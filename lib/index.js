var parser   = require(__dirname+"/../lib/parser.js").parser.parse;
var compiler = require(__dirname+"/../lib/compiler.js").compiler;
var _        = require("./vendor/underscore");
var vm       = require("vm");

function Bluemold(input, data, templateName){
  var sandbox = {}, compiled, parsed;
  try {
    parsed = parser(input);
  } catch (e) {
    return e;
  }

  try {
    compiled = compiler(parsed);

    _.extend(sandbox, data);
    sandbox._ = _;

    sandbox.Bluemold = function(i, context, templateName){
      return Bluemold(i, data);
    };

    var script = vm.createScript(compiled);
    return script.runInNewContext(sandbox, "BluemoldTemplate"); //runInThisContext(sandbox.compiled, "BlueMoldTemplate");

  } catch (e) {
    e.source   = input;
    e.template = templateName;
    if(e.stack){
      var stack = e.stack.split(/\n/ig)[1];
      e.lineNumber = (compiled.substr(0, stack.match(/\d+$/)[0]).match(/\\n/ig) || []).length+1;
    }
    return e;
  }
}

exports.Bluemold = Bluemold;
