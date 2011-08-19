var parser   = require(__dirname+"/../lib/parser.js");
var compiler = require(__dirname+"/../lib/compiler.js").compiler;
var Bluemold = require(__dirname+"/../lib").Bluemold;
var _        = require("underscore");
var c        = Bluemold;

function generator(parsed, data){
  var compiled = compiler(parsed),
      context  = _.extend(this,data);

  context._ = _;
  context.Bluemold = Bluemold;

  try {
    return (new Function("return "+compiled))();
  } catch (e) {
    return e;
  }
}

describe('trailing semicolons', function(){
  it("should return the quoted text", function(){
    expect(generator([["text","'hello' \"world\""]])).toEqual("'hello' \"world\"");
  });
});
describe('value', function(){
  it("should return the value", function(){
    expect(generator([["value","a"]], {a:"foo"})).toEqual("foo");
  });

  it("should ignore null values", function(){
    expect(generator([["value","a"]], {a:null})).toEqual("");
  });

  it("returns strings", function(){
    expect(c('${"hello"}')).toEqual("hello");
    expect(c("${'hello'}")).toEqual("hello");
  });

  it("returns single and double quoted strings", function(){
    expect(c('${"\'hello\' world"}')).toEqual("'hello' world");
    expect(c("${'\"hello\" world'}")).toEqual('"hello" world');
  });

  it("does not escape HTML and is not compatible with jQuery templates", function(){
    expect(c('${"<b>&"}')).toEqual("<b>&")
  });

  it("can also be written as {{= ... }}", function(){
    expect(c('{{= "hello"}}')).toEqual("hello");
  })

  it("can define a value with ${property = 'value'}", function(){
    expect(c('hello ${p = 12} ${p}')).toEqual("hello 12 12");
  });
});

describe('html', function(){
  it("returns an unescaped HTML value", function(){
    expect(c('{{html "<b>&"}}')).toEqual("<b>&")
  });

  it("should ignore null values", function(){
    expect(c('hello {{html null}}')).toEqual("hello ");
  });

});

describe('tmpl', function(){
  it("renders a subtemplate in the global object", function(){
    expect(c('{{tmpl partial}}', {partial : "${v}", v: "hello"})).toEqual("hello");
  });

  it("renders sub,sub,... templates", function(){
    var d = {
      ta : "{{tmpl tb}}",
      tb : "{{tmpl tc}}",
      tc : "fini" };

    expect(c('{{tmpl ta}}', d)).toEqual("fini");
  });

  it("accepts an object as context", function(){
    expect(c('{{tmpl({v:"goodbye"}) partial}}', {partial : "${v}", v: "hello"})).toEqual("goodbye");
  });

  it("accepts an array as context", function(){
    expect(c('{{tmpl([{v:"goodbye"},{v:"hello"}]) partial}}', {partial : "${v}"})).toEqual("goodbyehello");
  });
});

describe('if & else', function(){
  it("return if true", function(){
    expect(generator([["if","1 > 2", [["text", "true"]]]])).toEqual("");
    expect(generator([["if","3 > 2", [["text", "true"]]]])).toEqual("true");
  });

  it("can have have an else block", function(){
    var code = parser.parse("{{if 1 > 2}}a{{else}}b{{/if}}")
    expect(generator(code)).toEqual("b");
  });

  it("can have have multiple else blocks", function(){
    var code = parser.parse("{{if 1 > 2}}a{{else 2 > 3}}b{{else 3 < 5}}c{{else}}d{{/if}}")
    expect(generator(code)).toEqual("c");
  });

  it("can have each blocks inside an else block", function(){
    var each = "{{each [1,2,3]}}x{{/each}}";
    var code = parser.parse("{{if 1 > 2}}a{{else 2 > 3}}b{{else 3 < 5}}"+each+"{{else}}d{{/if}}");
    expect(generator(code)).toEqual("xxx");
  });

  it("should not evaluate a block if not reached", function(){
    var code = parser.parse("{{if false}}${a = 'invalid'}{{else}}${a}{{/if}}");
    expect(generator(code, {a:"valid"})).toEqual("valid");
  });
});

describe('each', function(){
  it("repeats the block for each item", function(){
    expect(generator([["each","[1,2,3]", [["text", "x "]]]])).toEqual("x x x ");
  });

  it("sets the $value in the block", function(){
    expect(generator([["each","[1,2,3]", [["value", "$value"]]]])).toEqual("123");
  });

  it("sets the $index in the block", function(){
    var data   = ["a","b","c"],
        parsed = [["each","data", [["value", "$value"],["value","$index"]]]];

    expect(generator(parsed, {data:data})).toEqual("a0b1c2");
  });

  it("allows defining the $value and $index variable names", function(){
    expect(c("{{each(X,Y) ['A','B']}}${X}-${Y}{{/each}}")).toEqual("0-A1-B");
  });

  it("does not error when a collection is null", function(){
    expect(c("{{each foo}}ok{{/each}}")).toEqual("");
  });
});

describe("multiline templates", function(){
  it("will render them", function(){
    var parsed = [["text","hello\nworld"]];
    expect(
      generator(parsed)).toEqual(
    "hello\nworld")
  });
});
