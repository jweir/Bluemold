var parser   = require(__dirname+"/../lib/parser.js").parser;
var compiler = require(__dirname+"/../lib/compiler.js").compiler;
var _        = require("./vendor/underscore");
var vm       = require("vm");

function Bluemold(input, data, templateName){
  templateName = templateName || "unknown";

  // If the context is an array, map it
  if(data && data.length){
    return _.map(data, function(n){ return Bluemold(input, n, templateName); }).join("");
  }

  var sandbox = { _ : _, $data : data },
      compiled;

  try {
    compiled = compiler(
      parser.parse(input)
    );

    // Ensure that {{tmpl}} get either a new context or this context
    _.extend(sandbox, data);
    sandbox.Bluemold = function(i, context, templateName){
      return Bluemold(i, context || data, templateName);
    };

    return build(compiled, sandbox);

  } catch (error) {
    error.lineNumber = error.line || "unknown";
    return errorMessage(error, input, templateName, compiled);
  }
}

function build(compiled, sandbox){
  if(typeof vm === 'undefined'){
    // Eventually this will be runnable in a non-node/CommonJS env
    _.extend(this,sandbox);
    return (new Function("return "+compiled))();
  } else {
    return vm.createScript(compiled).runInNewContext(sandbox, "BluemoldTemplate");
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
