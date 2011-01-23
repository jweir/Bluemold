var _ = require("./vendor/underscore");
var parser = require("./parser").parser.parse;

exports.compiler = function(input, data){
  var template = [],
      context  = this;

  context._ = _;
  context.Bluemold = function(t,d){ return exports.compiler(parser(t), d || this);};
  _.extend(context,data);

  var code = loop(input).replace(/\n/im,"\\n");
  try {
    return (new Function("return "+code))();
  } catch (e) {
    return e;
  }
}

// item is a tuple [command, args, [,args]]
function handle(item, index, template){
  var command = item.shift(),
      code    = commands[command].apply(this, item);

  template.push(code);
}

function escape(str){
  var escaped = str.replace(/'/ig,"\\'");
  return escaped;
}

function loop(input, join){
  var template = [];
  _(input).each(function(item, index){ handle(item, index, template); });
  return template.join(join || "+");
}

function htmlEscape(str){
  return str
         .replace(/&/ig,"&amp;")
         .replace(/</ig,"&lt;")
         .replace(/>/ig,"&gt;")
}

var commands = {
  "text" : function(text){
    return "(function(){ return '"+escape(text)+"'})()";
  },
  "value" : function(arg){
    return htmlEscape(arg);
  },
  "="     : function(arg) {
    return commands.value(arg);
  },
  "html"  : function(arg){
    return arg;
  },
  "tmpl"  : function(propety) {
    return "Bluemold("+propety+")";
  },
  "if"    : function(expression, blocks, else_blocks){
    var tail = else_blocks ? loop(else_blocks, " ") : "else{return ''}";
    return "(function(){if("+expression+"){return "+loop(blocks)+"}"+tail+"})()";
  },
  "each" : function(args, blocks){
    return "(function(){ return _.map("+args+", function($value,$index){ with($value){ return "+loop(blocks)+"}}).join('')})()";
  },
  "else" : function(args, block){
    return "else if("+args+"){return "+loop(block," ")+"}"
  }
};
