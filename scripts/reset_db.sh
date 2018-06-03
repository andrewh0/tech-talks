#!/bin/bash

set -e

yarn run sequelize db:drop
yarn run sequelize db:create
yarn run sequelize db:migrate
yarn run sequelize db:seed:all
