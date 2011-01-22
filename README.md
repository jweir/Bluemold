# Bluemold Template Engine

Bluemold is a Javascript template engine. It conforms to a subset of the jQuery Template language.

It is designed to run serverside (Node.js) and output HTML or any text based format.

## Usage

`Bluemold(template, {})`

## A really simple example

    var Bluemold = require('./lib/').Bluemold;
    var template = '{{each [{name:"dog"},{name:"cat"}]}} I ${word} myself a ${name}.\n{{/each}}';

    Bluemold(template,{word: "love"});

    "I love myself a dog.
    I love myself a cat."

## Current State

Newborn.  Brand spanking new. Untested. Not used in production... yet.

No support for the {{tmpl}} command... yet.
No proper error messages... yet.
No support for the `wrap` function... and may never.

## Requirements

[Underscore](http://documentcloud.github.com/underscore/) is the only requirement for rendering the templates.

For development [PEG.JS](http://pegjs.majda.cz/) is used to create the parser. The specs are written using [Jasmine](http://pivotal.github.com/jasmine/).

## Development & helping out

I would love contributors, fork away! But please use 2 soft space indents and write specs for any new features.

`scripts/build` will regenerate the parser.
`scripts/spec` will run the tests.

Install the Watchr gem and `watchr .watchr` to automatically build or spec on demand.

    gem install watchr

## Bugs

Reports bugs [here](https://github.com/jweir/Bluemold/issues). You get 1 point.

Fork the project and create a failing spec – 100 points.

Fork the project, create a failing spec and then fix the feature – 100 points and a mystery powerup!

## Other jQuery Template projects

[Node JQTP](https://github.com/kof/node-jqtpl) is another jQuery Template engine for Node.
