var parser   = require(__dirname+"/../lib/parser.js").parser;
var compiler = require(__dirname+"/../lib/compiler.js").compiler;
var _        = require(__dirname+"/../lib/vendor/underscore");

function c(template,data){
  return compiler(parser.parse(template, data));
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

  it("returns strings", function(){
    expect(c('${"hello"}')).toEqual("hello");
    expect(c("${'hello'}")).toEqual("hello");
  });

  it("returns single and double quoted strings", function(){
    expect(c('${"\'hello\' world"}')).toEqual("'hello' world");
    expect(c("${'\"hello\" world'}")).toEqual('"hello" world');
  });
});

describe('comments', function(){});
describe('html', function(){});
describe('tmpl', function(){});

describe('if & else', function(){
  it("return if true", function(){
    expect(compiler([["if","1 > 2", [["text", "true"]]]])).toEqual("");
    expect(compiler([["if","3 > 2", [["text", "true"]]]])).toEqual("true");
  });

  it("can have have an else block", function(){
    var code = parser.parse("{{if 1 > 2}}a{{else}}b{{/if}}")
    expect(compiler(code)).toEqual("b");
  });

  it("can have have multiple else blocks", function(){
    var code = parser.parse("{{if 1 > 2}}a{{else 2 > 3}}b{{else 3 < 5}}c{{else}}d{{/if}}")
    expect(compiler(code)).toEqual("c");
  });

  it("can have each blocks inside an else block", function(){
    var each = "{{each [1,2,3]}}x{{/each}}";
    var code = parser.parse("{{if 1 > 2}}a{{else 2 > 3}}b{{else 3 < 5}}"+each+"{{else}}d{{/if}}");
    expect(compiler(code)).toEqual("xxx");
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
    var data   = ["a","b","c"],
        parsed = [["each","data", [["value", "$value"],["value","$index"]]]];

    expect(compiler(parsed, {data:data})).toEqual("a0b1c2");
  });

  it("allows defining the $value and $index variable names", function(){
    // expect().toEqual(true);
  });
});
