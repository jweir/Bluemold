var parser = require(__dirname+"/../lib/parser.js").parser;

function parse(s){ return parser.parse(s); }
function shouldParse(s, e){ expect(parse(s)).toEqual(e); }
function T(s){ return ['text', s]; }
function B(s){ return ['block', s]; }
function E(s){ return ['each', s]; }
function C(command, s){ return [command, s]; }

String.prototype.$ = function(e){ shouldParse(this, e); }

describe('simple', function(){

  it('should handle simple templates', function(){
    "just text"             .$ ([T('just text')]);
    "just text"             .$ ([T('just text')]);
    "text {{! [foo]}} text" .$ ([T('text '), C("comment", '[foo]'), T(' text')]);
  });

  it('should handle commands with objects', function(){
    "{{= {object:1}}}"       .$ ([C("=","{object:1}")]);
    "{{= {object:{}}}}"      .$ ([C("=","{object:{}}")]);
    "{{= {object:{ }}}}"     .$ ([C("=","{object:{ }}")]);
    "{{= {object:{a:2}}}}"   .$ ([C("=","{object:{a:2}}")]);
    "{{html {object:{{}}}}}" .$ ([C("html","{object:{{}}}")]);
    "{{html}}" .$ ([C("html","")]);
  });
});

describe("value", function(){
  it("should capture ${}", function(){
    "hello ${foo}" .$ ([T("hello "), C("value", "foo")]);
  });
})

describe("if/else", function(){
  it("should capture if and the else blocks", function(){
    "{{if 1}}a{{else}}b{{/if}}".$(
    [["if","1",
        [["text","a"]],
     [["else","true",
        [["text","b"]]]]]
    ]);
  });

  it("captures many else blocks with parameters", function(){
    "{{if 1}}a{{else 2}}b{{else}}c{{/if}}".$(
    [["if","1",
        [["text","a"]],
     [["else","2",
        [["text","b"]]],
     ["else","true",
        [["text","c"]]]]]
    ]);
  });

  it("should require a closing /if tag", function(){
    expect(function(){parse("{{if 1}}a{{else}}what");}).toThrow();
  });
});

describe("blocks", function(){
  it("should require a closing tag", function(){
    expect(function(){parse("{{each [1,2,3]}}");}).toThrow();
  });

  it("should error if the closing tag does not match", function(){
    expect(function(){parse("{{each}}{{/if}}");}).toThrow();
  });

  it("should have inner text or block", function(){
    "{{each foo}}hello{{/each}}" .$([["each", "foo", [["text","hello"]]]]);
    "{{each foo}}hello{{each bar}}1+1{{/each}}ok{{/each}}"
    .$([
        ["each", "foo", [
          ["text","hello"],
          ["each","bar", [
            ['text',"1+1"]
          ]],
          ["text","ok"]]]]);
  });
})
