var parser   = require("./parser.js");
var compiler = require("./compiler.js").compiler;
var _        = require("underscore");
var vm       = require("vm");

function Bluemold(input, data, templateName){
  var compiled;

  templateName = templateName || "unknown";

  // If the context is an array, map it
  if(data && data.length){
    return _.map(data, function(n){ return Bluemold(input, n, templateName); }).join("");
  }

  try {
    compiled = compiler(parser.parse(input));
    return build(compiled, sandbox(data));
  } catch (error) {
    error.lineNumber = error.line || "unknown";
    return errorMessage(error, input, templateName, compiled);
  }
}

function sandbox(data){
  var box = { _ : _, $data : data };

  _.extend(box, data);
  // Ensure {{tmpl}} gets either a new context or this context
  box.Bluemold = function(i, context, templateName){
    return Bluemold(i, context || data, templateName);
  };

  return box;
}

function build(compiled, sandbox){
  _.extend(this,sandbox);
  return vm.createScript(compiled).runInNewContext(sandbox, "BluemoldTemplate");
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
