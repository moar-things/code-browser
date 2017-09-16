#!/usr/bin/env bash

# run tests, capturing the output, only printing on failure

TOOLS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BASE_DIR=`dirname ${TOOLS_DIR}`
TMP_DIR=$BASE_DIR/tmp
TEST_OUTPUT=$TMP_DIR/test-results.txt

mkdir -p $TMP_DIR

FORCE_COLOR=1 $* > $TEST_OUTPUT

if [ $? -eq 0 ]
then
  exit 0
else
  cat $TEST_OUTPUT | $BASE_DIR/node_modules/.bin/tap-spec
  exit 1
fi
