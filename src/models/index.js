// @flow

import Sequelize from 'sequelize';
import configJson from '../../config/config.json';

import Video from './Video';
import User from './User';

const env = process.env.NODE_ENV || 'development';
const config = configJson[env];
const db = {};

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], {
      operatorsAliases: false
    })
  : new Sequelize(config.database, config.username, config.password, config);

// https://gist.github.com/ihavenoidea14/0dab8b461c057c427829fdc99bfb6743
const modules = [User, Video];

modules.forEach(module => {
  const model = module(sequelize, Sequelize);
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
