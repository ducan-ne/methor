#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "Your git status is not clean. Aborting.";
  exit 1;
fi

set -e
set -x

echo "Select a option to release (input a serial number)："
echo

select VERSION in patch minor major "Specific Version"
  do
    echo
    if [[ $REPLY =~ ^[1-4]$ ]]; then
      if [[ $REPLY == 4 ]]; then
        read -p "Enter a specific version: " -r VERSION
        echo
        if [[ -z $REPLY ]]; then
          VERSION=$REPLY
        fi
      fi

      read -p "Release $VERSION - are you sure? (y/n) " -n 1 -r
      echo

      if [[ $REPLY =~ ^[Yy]$ ]]; then
        # pre release task
        npm run test

        # bump version
        npm version $VERSION
        NEW_VERSION=$(node -p "require('./package.json').version")
        echo Releasing ${NEW_VERSION} ...

        # npm release
        npm publish
        echo "✅ Released to npm."

        # github release
        git add CHANGELOG.md
        git commit -m "chore: changelog"
        git push
        git push origin refs/tags/v${NEW_VERSION}
        echo "✅ Released to Github."
      else
        echo Cancelled
      fi
      break
    else
      echo Invalid \"${REPLY}\"
      echo "To continue, please input a serial number(1-4) of an option."
      echo
    fi
  done
