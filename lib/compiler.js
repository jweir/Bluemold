var _ = require("./vendor/underscore");
var parser = require("./parser").parser.parse;

exports.compiler = function(input){
  return loop(input).replace(/\n|\r/ig,"\\n");
}

// item is a tuple [command, args, [,args]]
function handle(item){
  var command = item.shift();
  return commands[command].apply(this, item);
}

function escape(str){
  return str.replace(/'/ig,"\\'");
}

function loop(input, join){
  return _.map(input, handle).join(join || "+");
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
