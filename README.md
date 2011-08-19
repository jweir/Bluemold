# Bluemold Template Engine

Bluemold is a Javascript template engine based on jQuery Template syntax.

It is designed to run serverside (Node.js) and output HTML or any text based format.

Bluemold is the template engine used for the portfolios at http://famedriver.com

## Install
    npm install bluemold

## Usage
    var Bluemold = require('bluemold');
    // Bluemold(<template>, <data>)

### Simple example
    Bluemold( "Hello ${world}. {{each words}}${$value} {{/each}}", {world: "Earth", words:["Where", "will", "we", "go?"]})

    // 'Hello Earth. Where will we go? '

### Javascript helper functions
    var data = {a:"Hello", f: function(s){ return s.toUpperCase()}}
    Bluemold("${f(a)} WORLD", data)

    // 'HELLO WORLD'

See the [specs]("https://github.com/jweir/Bluemold/tree/master/spec") for more examples

## Documentation
The supported tags are

* {{each}}{{/each}}
* {{if}}{{/each}}
* {{else}}
* {{html}}
* ${} & {{=}}
* {{tmpl}}

{{wrap}} is not supported.

See the [jQuery Template page](http://api.jquery.com/category/plugins/templates/).

Unlike jQeury templates, HTML is not escaped but default.

## TODO

Proper error messages with line numbers.

## Development & helping out

I would love contributors, fork away! But please use 2 soft space indents and write specs for any new features.

Besure to have `pegjs` and `jasmine-node` installed.   

     npm install pegjs
     npm install jasmine-node

     scripts/build # regenerate the parser
     scripts/spec  # run the tests 

## Bugs

Please reports bugs [here](https://github.com/jweir/Bluemold/issues)

## Other jQuery Template projects

[Node JQTP](https://github.com/kof/node-jqtpl) is another jQuery Template engine for Node.
