var _ = _ || require("./vendor/underscore");

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

var ignoreNull      = "if(result !== null) {return result} else { return ''}";
var functionOrValue = "var result = (typeof arg == 'function') ? arg() : arg";

function valueFrom(arg){
  return "function(){ var arg = ("+arg+"); "+functionOrValue+"; "+ignoreNull+"}()";
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
    return wrap(valueFrom(arg));
  },
  "tmpl"  : function(properties) {
    var args = [
      properties.partial,
      properties.args || 'undefined',
      "'"+properties.partial+"'"];

    return "Bluemold("+args.join(",")+")";
  },
  "each" : function(data, blocks){
    var labels = "$index,$value";
    if(data.args){ labels = data.args; data = data.data; }
    labels = labels.split(",").reverse();
    return wrap("_.map("+data+", function("+labels+"){ with("+labels[0]+"){ return "+loop(blocks)+"}}).join('')");
  },
  "if"    : function(expression, blocks, else_blocks){
    var tail = else_blocks ? loop(else_blocks, " ") : "else { return ''}";
    return block("if("+expression+"){return "+loop(blocks)+"}"+tail);
  },
  "else" : function(args, block){
    return "else if("+args+"){return "+loop(block)+"}";
  }
};
