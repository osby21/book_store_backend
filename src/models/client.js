'use strict';
module.exports = (sequelize, DataTypes) => {
  const client = sequelize.define('client', {
    firstName: DataTypes.STRING, 
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userid: DataTypes.STRING,
    gender: DataTypes.STRING,
    verified: DataTypes.STRING
  }, {});
  client.associate = function(models) {
    // associations can be defined here
    models.client.hasMany(models.address, { foreignKey: 'custId' });  
    models.client.hasMany(models.payment, { foreignKey: 'custId' });  

  };
  return client;
};