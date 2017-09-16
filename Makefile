.PHONY: help build test watch

BIN=node_modules/.bin

help:
	@echo "targets available:"
	@echo "    build:    rebuild the universe"
	@echo "    test:     run tests"
	@echo "    watch     run build then test when files change"

watch:
	@FORCE_COLOR=1 ${BIN}/nodemon --exec "make watch-task; true"

watch-task:
	@make build
	@echo ""
	@make test

build:
	@echo "starting build at `date`"
	@tools/date-util.js > tmp/time-build.txt

	@mkdir -p tmp

	@echo "running lessc ..."
	@${BIN}/lessc \
		--source-map=docs/app.css.map.json \
		--source-map-less-inline \
		css/app.less \
		docs/app.css

	@echo "running browserify for tests ..."
	@${BIN}/browserify \
		--outfile tmp/tests-browserified.js \
		--debug \
		test/index.js

	@echo "running cat-source-map for tests ..."
	@${BIN}/cat-source-map --fixFileNames tmp/tests-browserified.js docs/tests.js

	@echo "running browserify for app ..."
	@${BIN}/browserify \
		--outfile tmp/app-browserified.js \
		--debug \
		lib/web/main.js

	@echo "running cat-source-map for app ..."
	@${BIN}/cat-source-map --fixFileNames tmp/app-browserified.js docs/app.js

	@echo "finished build at `date`"
	@tools/date-util.js tmp/time-build.txt "ran in %s seconds"

test:
	@echo "starting test at `date`"
	@tools/date-util.js > tmp/time-test.txt

	@echo "running standard"
	@node ${BIN}/standard -v

	@echo "running tests"
	@tools/wrap-test.sh "node test/index.js"
	@echo "unit tests ran successfully!!"

	@echo "finished test at `date`"
	@tools/date-util.js tmp/time-test.txt "ran in %s seconds"
