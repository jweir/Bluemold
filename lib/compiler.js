var _ = require("./vendor/underscore");
var parser = require("./parser").parser.parse;

exports.compiler = function(input){
  return loop(input).replace(/\n|\r/ig,"\\n");
}

function loop(input, join){
  return _.map(input, handle).join(join || "+");
}

// item is a tuple [command, args, [,args]]
function handle(item){
  var command = item.shift();
  return commands[command].apply(this, item);
}

function block(code){
  return "(function(){"+code+"})()";
}

function wrap(code){
  return block("return "+code);
}

function escape(str){
  return str.replace(/'/ig,"\\'");
}

function htmlEscape(str){
  return str
         .replace(/&/ig,"&amp;")
         .replace(/</ig,"&lt;")
         .replace(/>/ig,"&gt;")
}

function valueFrom(arg){
  return "(typeof "+arg+" == 'function') ? "+arg+"() : "+arg;
}

var commands = {
  "comment" : function(){
    return wrap("''");
  },
  "text" : function(text){
    return wrap("'"+escape(text)+"'");
  },
  "value" : function(arg){
    return wrap(htmlEscape(valueFrom(arg)));
  },
  "="     : function(arg) {
    return commands.value(arg);
  },
  "html"  : function(arg){
    return wrap(arg);
  },
  "tmpl"  : function(propertyOrString) {
    // TODO add template name
    return "Bluemold("+propertyOrString+")";
  },
  "each" : function(args, blocks){
    return wrap("_.map("+args+", function($value,$index){ with($value){ return "+loop(blocks)+"}}).join('')");
  },
  "if"    : function(expression, blocks, else_blocks){
    var tail = else_blocks ? loop(else_blocks, " ") : "else { return ''}";
    return block("if("+expression+"){return "+loop(blocks)+"}"+tail);
  },
  "else" : function(args, block){
    return "else if("+args+"){return "+loop(block," ")+"}";
  }
};
