#!/bin/bash
set -euxo pipefail

git subtree push --prefix public/ origin gh-pages
