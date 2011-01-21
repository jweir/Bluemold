var parser   = require(__dirname+"/../lib/parser.js").parser;
var compiler = require(__dirname+"/../lib/compiler.js").compiler;
var _        = require(__dirname+"/../lib/vendor/underscore");

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
  it("return if true", function(){
    expect(compiler([["if","1 > 2", [["text", "true"]]]])).toEqual("");
    expect(compiler([["if","3 > 2", [["text", "true"]]]])).toEqual("true");
  });

  it("can have have an else block", function(){
    // expect(compiler([["if","1 > 2", [["text", "true"]],[["text","false"]]]])).toEqual("false");
    // expect(compiler([["if","3 > 2", [["text", "true"]],[["text","false"]]]])).toEqual("true");
  });
});

describe('each', function(){
  it("repeats the block for each item", function(){
    expect(compiler([["each","[1,2,3]", [["text", "x "]]]])).toEqual("x x x ");
  });

  it("sets the $value in the block", function(){
    expect(compiler([["each","[1,2,3]", [["value", "$value"]]]])).toEqual("123");
  });

  it("sets the $index in the block", function(){
    expect(compiler([["each","['a','b','c']", [["value", "$value"],["value","$index"]]]])).toEqual("a0b1c2");
  });

  it("allows defining the $value and $index variable names", function(){
    // expect().toEqual(true);
  });
});

describe("context", function(){
  it("finds the first available property", function(){

  })
});
