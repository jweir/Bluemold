'use strict';

module.exports = Bluemold;
module.exports.sandbox = setSandbox;
module.exports.decorateError = decorateError;

var parser   = require("./parser.js"),
    compiler = require("./compiler.js").compiler,
    _        = require("underscore"),
    vm       = require("vm"),
    $sandbox = {};

function Bluemold(input, data, templateName){
  var compiled;

  templateName = templateName || "unknown";

  // If the context is an array, map it
  if(data && data.length){
    var fn = function(n){ return Bluemold(input, n, templateName); }
    return _(data).map(fn).join("");
  }

  try {
    compiled = compiler(parser.parse(input));
    return build(compiled, sandbox(data));
  } catch (error) {
    error.lineNumber = error.line || "unknown";
    error.source     = input;
    error.template   = templateName;
    error.compiled   = compiled;
    return errorMessage(error);
  }
}

// Add global data or functions accessible in all templates
function setSandbox(box){
  $sandbox = box;
  return $sandbox;
}

// private

function sandbox(data){
  var box = { _ : _, $data : data };

  _.extend(box, $sandbox);
  _.extend(box, data);
  // Ensure {{tmpl}} gets either a new context or this context
  box.Bluemold = function(i, context, templateName){
    return Bluemold(i, context || data, templateName);
  };

  return box;
}

function build(compiled, sandbox){
  _.extend(this,sandbox);
  return vm.runInNewContext(compiled, sandbox, "BluemoldTemplate");
}

function errorMessage(e){
  if(e.stack && e.compiled){
    var stack         = e.stack.split(/\n/ig)[1];
    var errorPosition = (stack.match(/\d+$/) || [0])[0];
    if(errorPosition){
      e.lineNumber = (e.compiled.substr(0,errorPosition).match(/\\n/ig) || []).length+1;
    }
  }

  return errorTemplate ? Bluemold(errorTemplate, e) : e;
}

var errorTemplate = null;

function decorateError(template){ errorTemplate = template; }
