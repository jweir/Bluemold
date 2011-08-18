# Bluemold Template Engine

Bluemold is a Javascript template engine based on jQuery Template syntax.

It is designed to run serverside (Node.js) and output HTML or any text based format.

Bluemold is the template engine used for the portfolios at http://famedriver.com

## Install & Usage
    npm install bluemold

## Usage
    var Bluemold = require('bluemold').Bluemold

    Bluemold( "Hello ${world}. {{each words}}${$value} {{/each}}", {world: "Earth", words:["Where", "will", "we", "go", "?"]})

    // 'Hello Earth. Where will we go ? '

## Documentation

See the [jQuery Template page](http://api.jquery.com/category/plugins/templates/)

The supported tags are

* {{each}}
* {{if}}
* {{else}}
* {{html}}
* ${} & {{=}}
* {{tmpl}}

{{wrap}} is not supported.

## TODO

Proper error messages with line numbers.

## Dependencies

Bluemold is installed with

[Underscore](http://documentcloud.github.com/underscore/)

For development [PEG.JS](http://pegjs.majda.cz/) is used to create the parser. The specs are written using [Jasmine](http://pivotal.github.com/jasmine/).

## Development & helping out

I would love contributors, fork away! But please use 2 soft space indents and write specs for any new features.

`scripts/build` will regenerate the parser.
`scripts/spec` will run the tests.

## Bugs

Reports bugs [here](https://github.com/jweir/Bluemold/issues). You get 1 point.

Fork the project and create a failing spec – 100 points.

Fork the project, create a failing spec and then fix the feature – 100 points and a mystery powerup!

## Other jQuery Template projects

[Node JQTP](https://github.com/kof/node-jqtpl) is another jQuery Template engine for Node.
