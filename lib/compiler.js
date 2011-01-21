var _ = require("./vendor/underscore");

exports.compiler = function(input, data){
  var template = [];
  var context  = this;

  context._ = _;
  _.each(_.keys(data || {}), function(key){ context[key] = data[key]; });

  var code = loop(input);
  // console.log("\n\n", input, "\n", code);
  return (new Function("return "+code))();
}

// item is a tuple [command, args, [,args]]
function handle(item, index, template){
  if(typeof item[0] == "array"){
  } else {
    var command = item.shift();
    var code    = commands[command].apply(this, item);
    template.push(code);
  }
}

function escape(str){
  return str.replace(/'/ig,"\\'");
}

function loop(input, join){
  var template = [];
  _.each(input, function(item, index){
    handle(item, index, template);
  });
  return template.join(join || "+");
}

var commands = {
  "text" : function(text){
    return "(function(){ return '"+escape(text)+"'})()";
  },
  "value" : function(arg){
    return arg; //"this"; //["+arg+"]";
  },
  "if"    : function(expression, blocks, else_blocks){
    var tail = else_blocks ? loop(else_blocks, " ") : "else{return ''}";
    return "(function(){if("+expression+"){return "+loop(blocks)+"}"+tail+"})()";
  },
  "each" : function(args, blocks){
    return "(function(){ return _.map("+args+", function($value,$index){ return "+loop(blocks)+"}).join('')})()";
  },
  "else" : function(args, block){
    return "else if("+args+"){return "+loop(block," ")+"}"
  }

};
