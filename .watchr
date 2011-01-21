watch('lib/.*|spec/.*') { puts `./scripts/specs` }
watch('lib/.*\.pegjs') { puts `./scripts/build` }
