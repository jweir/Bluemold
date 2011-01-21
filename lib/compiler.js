var _ = require("./vendor/underscore");

function compiler(input, data){
  var template = [];
  var context  = this;

  context._ = _;
  _.each(_.keys(data || {}), function(key){ context[key] = data[key]; });

  var code = looper(input);
  // console.log(code);
  return (new Function("return "+code))();
}

function loop(input, template){
  _.each(input, function(item, index){
    handle(item, index, template);
  });
}

function handle(item, index, template){
  if(typeof item[0] == "array"){
  } else {
    var code = tags[item.shift()].apply(this, item);
    template.push(code);
  }
}

function escape(str){
  return str.replace(/'/ig,"\\'");
}

function looper(input){
  var template = [];
  _.each(input, function(item, index){
    handle(item, index, template);
  });
  return template.join("+");
}

var tags = {
  "text" : function(text){
    return "(function(){ return '"+escape(text)+"'})()";
  },
  "value" : function(arg){
    return arg; //"this"; //["+arg+"]";
  },
  "if"    : function(expression, blocks){
     return "(function(){if("+expression+"){return "+looper(blocks)+"}else{return ''}})()";
  },
  "each" : function(args, blocks){
    return "(function(){ return _.map("+args+", function($value,$index){ return "+looper(blocks)+"}).join('')})()";
  }

};


exports.compiler = compiler;
