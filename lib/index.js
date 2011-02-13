var parser   = require(__dirname+"/../lib/parser.js").parser;
var compiler = require(__dirname+"/../lib/compiler.js").compiler;
var _        = require("./vendor/underscore");
var vm       = require("vm");

function Bluemold(input, data, templateName){
  var sandbox = {
        _ : _,
        $data : data
      },
      compiled, parsed;

  try { parsed = parser.parse(input); }
  catch (e) {
    e.lineNumber = e.line;
    return errorMessage(e, input, templateName);
  }

  try {
    compiled = compiler(parsed);

    _.extend(sandbox, data);
    sandbox.Bluemold = function(i, context, templateName){
      return Bluemold(i, data, templateName);
    };

    if(typeof vm === 'undefined'){
      // Eventually this will be runnable in a non-node/CommonJS env
      _.extend(this,sandbox);
      return (new Function("return "+compiled))();
    } else {
      return vm.createScript(compiled).runInNewContext(sandbox, "BluemoldTemplate");
    }

  } catch (error) {
    return errorMessage(error, input, templateName, compiled);
  }
}

function errorMessage(e, input, templateName, compiled) {
  e.source   = input;
  e.template = templateName;
  e.compiled = compiled;
  if(e.stack && compiled){
    var stack         = e.stack.split(/\n/ig)[1];
    var errorPosition = (stack.match(/\d+$/) || [0])[0];
    if(errorPosition){
      e.lineNumber = (compiled.substr(0,errorPosition).match(/\\n/ig) || []).length+1;
    }
  }

  return e;
}

exports.Bluemold = Bluemold;
