#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/api"

if [ ! -f .env ]; then
  cp .env.example .env
fi

if [ ! -d node_modules ]; then
  npm install
fi

node app.js
