#!/bin/bash

set -e

yarn

# https://dev.to/kellyjandrews/docker-compose-entrypoint-to-check-for-postgres
while ! pg_isready -h "postgres" -p "5432" > /dev/null 2> /dev/null; do
  >&2 echo "Postgres is unavailable"
  sleep 1
done

./scripts/reset_db.sh

yarn start
