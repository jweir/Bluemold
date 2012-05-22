var _ = _ || require("underscore");

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

var ignoreNull      = "return (result == null) ? '' :result";
var functionOrValue = "(typeof arg == 'function') ? arg() : (arg != null ? (arg.toString ? arg.toString() : arg) : arg)";

function valueFrom(arg){
  if(arg.replace(/\s+/,"").length < 1){ return "''"; }
  return "function(){"+defineUndefined(arg)+"var arg = ("+arg+"); var result = "+functionOrValue+"; "+ignoreNull+"}()";
}

function defineUndefined(arg){return "if(typeof ("+arg+") == 'undefined'){ return '' };"}
function guardValue(arg){ return "typeof "+arg+" == 'undefined' ? null : "+arg; }
function guardCollection(arg){ return "typeof "+arg+" == 'undefined' ? [] : "+arg; }

var commands = {
  "comment" : function(){
    return wrap("''");
  },
  "text" : function(text){
    return wrap("'"+escape(text)+"'");
  },
  "value" : function(arg){
    return wrap(valueFrom(arg));
  },
  "="     : function(arg) {
    return commands.value(arg);
  },
  "html"  : function(arg){
    return wrap(valueFrom(arg));
  },
  "tmpl"  : function(properties) {
    var new_context = properties.args ? "_.defaults("+properties.args+",$data)" : 'undefined'

    var args = [
      properties.partial,              // the partial's proprerty
      new_context                   ,  // a new context
      "'"+properties.partial+"'"];     // the partial's name

    return "bluemold("+args.join(",")+")";
  },
  "each" : function(data, blocks){
    var labels = "$index,$value";
    if(data.args){ labels = data.args; data = data.data; }
    labels = labels.split(",").reverse();
    collection = guardCollection(data);
    return wrap("_.map("+collection+", function("+labels+"){ var $i = arguments[0]; with("+labels[0]+"){ return "+loop(blocks)+"}}).join('')");
  },
  "if"    : function(expression, blocks, else_blocks){
    var tail = else_blocks ? loop(else_blocks, " ") : "else { return ''}";
    return block("if("+expression+"){return "+loop(blocks)+"}"+tail);
  },
  "else" : function(args, block){
    return "else if("+args+"){return "+loop(block)+"}";
  }
};
