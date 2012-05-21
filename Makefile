build:
	./node_modules/pegjs/bin/pegjs lib/parser.pegjs

test:
	node_modules/jasmine-node/bin/jasmine-node spec

.PHONY: test
