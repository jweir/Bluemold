var parser = require("../lib/sample.js").parser;

function parse(s){ return parser.parse(s); }
function shouldParse(s, e){ expect(parse(s)).toEqual(e); }
function T(s){ return ['text', s]; }
function B(s){ return ['block', s]; }
function E(s){ return ['each', s]; }
function C(command, s){ return [command, s]; }

String.prototype.$ = function(e){ shouldParse(this, e); }

describe('simple', function(){

  it('should handle simple templates', function(){
    "just text"           .$ ([T('just text')]);
    "just text"           .$ ([T('just text')]);
    "text {{! [foo]}} text" .$ ([T('text '), C("!", '[foo]'), T(' text')]);
  });

  it('should handle commands with objects', function(){
    "{{= {object:1}}}"     .$ ([C("=","{object:1}")]);
    "{{= {object:{}}}}"    .$ ([C("=","{object:{}}")]);
    "{{= {object:{ }}}}"   .$ ([C("=","{object:{ }}")]);
    "{{= {object:{a:2}}}}" .$ ([C("=","{object:{a:2}}")]);
    "{{html {object:{{}}}}}"  .$ ([C("html","{object:{{}}}")]);
  });
});

describe("blocks", function(){
  it("should require a closing tag", function(){
    expect(function(){parse("{{each [1,2,3]}}");}).toThrow();
    expect(parse("{{each [1,2,3]}}{{/if}}")).toEqual(["error"]);
    "{{each [1,2,3]}}{{/each}}" .$([E("[1,2,3]")]);
  });

  it("should have inner text or block", function(){
    "{{each foo}}hello{{/each}}" .$([["each", "foo", [["text","hello"]]]]);
    "{{each foo}}hello{{each bar}}1+1{{/each}}ok{{/each}}" .$([["each", "foo", [["text","hello"],["each","bar", [['text',"1+1"]]],["text","ok"]]]]);
  });
})
