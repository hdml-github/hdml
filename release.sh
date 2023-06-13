#!/bin/bash

# @author Artem Lytvynov
# @copyright Artem Lytvynov
# @license Apache-2.0

. .token

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "master" ]]; then
  echo 'Must be run from the master branch';
  exit 1;
fi

RELEASE=$1
if [ "v$RELEASE" == "v" ]; then
  RELEASE=patch
fi

./node_modules/.bin/lerna version --create-release=github --conventional-commits $RELEASE