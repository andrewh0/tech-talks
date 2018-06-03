// @flow

const User = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    displayName: DataTypes.STRING,
    twitterId: DataTypes.STRING,
    username: DataTypes.STRING,
    avatar: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });

  return User;
};

export default User;
