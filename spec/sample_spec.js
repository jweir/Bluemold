var parser = require("../lib/sample.js").parser;

function parse(s){ return parser.parse(s); }
function shouldParse(s, e){ expect(parse(s)).toEqual(e); }
function T(s){ return ['text', s]; }
function B(s){ return ['block', s]; }

String.prototype.$ = function(e){ shouldParse(this, e); }

describe('simple', function(){
  var result;

  it('should handle simple templates', function(){
    "just text"           .$ ([T('just text')]);
    "just text"           .$ ([T('just text')]);
    "{{block}}"           .$ ([B('block')]);
    "text {{block}} text" .$ ([T('text '), B('block'), T(' text')]);
  });

  it('should handle blocks with objects', function(){
    "{{block {object:1}}}"     .$ ([B("block {object:1}")]);
    "{{block {object:{}}}}"    .$ ([B("block {object:{}}")]);
    "{{block {object:{ }}}}"   .$ ([B("block {object:{ }}")]);
    "{{block {object:{a:2}}}}" .$ ([B("block {object:{a:2}}")]);
    "{{block {object:{{}}}}}"  .$ ([B("block {object:{{}}}")]);
  });

});
