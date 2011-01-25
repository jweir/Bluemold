var Bluemold = require( "./../lib/" ).Bluemold;
var a = require( "assert" );

var tpl1 = "<div>${a}</div>",
    tpl2 = "<div>{{= a}}</div>",
    tpl3 = "<div>${$data.a}</div>",
    tpl4 = "<div>${$item.data.a}</div>",
    tpl5 = "<div>${$item.someFunction()}</div>",
    tpl6 = "{{html a}}",
    tpl9 = "{{if a == 1}}<div>${a}</div>{{/if}}",
    tpl11 = "{{if a == 1}}<div>${a}</div>{{else}}2{{/if}}",
    tpl12 = "{{if a == 1}}<div>${a}</div>{{else a==2 }}2{{else}}3{{/if}}";

// "template" method

function equals(actual,expected,message){
  describe(message, function(){
    it("should work", function(){
      expect(actual).toEqual(expected);
    });
  });
}

function pending(actual,expected,message){
  describe(message, function(){
    it("may eventually work", function(){
      //expect(actual).toEqual(expected);
    });
  });
}

equals( Bluemold(tpl2, {a:1}), "<div>1</div>", "use simple data object, using {{= }} in the template " );
pending( Bluemold(tpl1, [{a:1}]), "<div>1</div>", "use an array with one object element" );
pending( Bluemold(tpl2, [{a:1}]), "<div>1</div>", "use an array with one object element, using {{= }} in the template" );
pending( Bluemold(tpl1, [{a:1},{a:2}]), "<div>1</div><div>2</div>", "use an array with 2 objects" );
equals( Bluemold(tpl1, {a: function(){return 1;}}), "<div>1</div>", "use function as a value" );
equals( Bluemold(tpl1,{a:'<div id="123">2</div>'}), "<div>&lt;div id=&quot;123&quot;&gt;2&lt;/div&gt;</div>", "escaping per default" );

// local variables
equals( Bluemold(tpl3, {a:1}), "<div>1</div>", "test access to $data" );
pending( Bluemold(tpl4, {a:1}), "<div>1</div>", "test access to $item" );
pending( Bluemold(tpl5, null, {someFunction: function() {return 1;}}), "<div>1</div>", "test access to $item" );

// ${html}
equals( Bluemold(tpl6,{a:'<div id="123">2</div>'}), '<div id="123">2</div>', 'output html without escaping');


// ${if}
equals( Bluemold(tpl9,{a:1}), "<div>1</div>", "test 'if' when true" );
equals( Bluemold(tpl9,{a:2}), "", "test 'if' when false" );

// ${else}
equals( Bluemold(tpl11,{a:1}), "<div>1</div>", "test else when true" );
equals( Bluemold(tpl11,{a:2}), "2", "test else when false" );
equals( Bluemold(tpl12,{a:2}), "2", "test else =2" );
equals( Bluemold(tpl12,{a:3}), "3", "test else =3" );

// {{each}}
equals(
    Bluemold(
        "{{each(index, value) names}}<div>${index}.${value}</div>{{/each}}",
        {names: ["A", "B"]}
    ),
    "<div>0.A</div><div>1.B</div>", "test 'each', use index and value, explizitely mapping them "
);
equals(
    Bluemold(
        "{{each names}}<div>${$index}.${$value}</div>{{/each}}",
        {names: ["A", "B"]}
    ),
    "<div>0.A</div><div>1.B</div>", "test 'each', use index and name with auto mapping"
);
equals(
    Bluemold(
        "{{each getData()}}<div>${$value}</div>{{/each}}",
        {
            getData: function(){
                return [1,2,3];
            }
        }
    ),
    "<div>1</div><div>2</div><div>3</div>", "test 'each', using templates variables"
);
equals(
    Bluemold(
        "{{each data }}<div>${$value}</div>{{/each}}",
        {
            data: {1:1, 2:2, 3:3}
        }
    ),
    "<div>1</div><div>2</div><div>3</div>",
    "iterate over json in each loop"
);



// {{tmpl}}
pending(
    Bluemold(
        "{{tmpl(data) extTpl}}",
        {
            extTpl: "<div>${a}</div>",
            data: {a:123456}
        }
    ),
    "<div>123456</div>",
    "include template {{tmpl}}"
);

/*
// {{wrap}}

var tpl1 =
    '{{wrap "#tableWrapper"}}\
        <div>\
            First <b>content</b>\
        </div>\
        <div>\
            And <em>more</em> <b>content</b>...\
        </div>\
    {{/wrap}}';

var tpl2 =
    '<table><tbody>\
        <tr>\
            {{each $item.html("div")}}\
                <td>\
                    {{html $value}}\
                </td>\
            {{/each}}\
        </tr>\
    </tbody></table>';

jte.template( "#tableWrapper", tpl2 );
console.log(Bluemold(tpl1));
*/

// {{!}}
equals( Bluemold("<div>{{! its a comment}}</div>", {a:1}), "<div></div>", "comments work" );
