var parser   = require(__dirname+"/../lib/parser.js").parser;
var compiler = require(__dirname+"/../lib/compiler.js").compiler;
var _        = require(__dirname+"/../lib/vendor/underscore");

function c(input){
   var compiled = compiler(input);
   return (new Function(compiled))();
}

describe('text', function(){
  it("should return the quoted text", function(){
    expect(compiler([["text","'hello' \"world\""]])).toEqual("'hello' \"world\"");
  });
});

describe('value', function(){
  it("should return the value", function(){
    expect(compiler([["value","a"]], {a:"foo"})).toEqual("foo");
  });
});

describe('if', function(){
  it("should return if true", function(){
    expect(compiler([["if","1 > 2", ["text", "true"]]])).toEqual("");
    expect(compiler([["if","3 > 2", ["text", "true"]]])).toEqual("true");
  });
});

describe('each', function(){
  it("should repeat the block for each item", function(){
    expect(compiler([["each","[1,2,3]", ["text", "x "]]])).toEqual("x x x ");
  });
});
