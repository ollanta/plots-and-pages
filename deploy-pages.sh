#!/bin/bash
set -euxo pipefail

npm run build
git add -f public/build
git commit -m "Build bundle"
git subtree push --prefix public/ origin gh-pages
git reset HEAD~1
