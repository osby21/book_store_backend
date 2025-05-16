'use strict';
module.exports = (sequelize, DataTypes) => {
  const address = sequelize.define('address', {
    fullname: DataTypes.STRING,
    phone: DataTypes.STRING,
    orderId: DataTypes.INTEGER,
    custId: DataTypes.INTEGER,
    discrict: DataTypes.STRING,
    city: DataTypes.STRING,
    states: DataTypes.STRING,
    area: DataTypes.STRING,
    shipping: DataTypes.TEXT
  }, {});
  address.associate = function(models) {
    // associations can be defined here
    models.address.belongsTo(models.order, { foreignKey: 'orderId' });  
    models.address.hasMany(models.cart, { foreignKey: 'addressId' });  
    models.address.belongsTo(models.client, { foreignKey: 'custId' });      
  };
  return address;
};