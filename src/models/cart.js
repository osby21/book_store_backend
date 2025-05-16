'use strict';
module.exports = (sequelize, DataTypes) => {
  const cart = sequelize.define('cart', {
    productId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    orderId: DataTypes.INTEGER,
    addressId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    photo: DataTypes.STRING
  }, {});
  cart.associate = function(models) {
    // associations can be defined here
    models.cart.belongsTo(models.address, { foreignKey: 'addressId' });  
    models.cart.belongsTo(models.order, { foreignKey: 'orderId' });
  };
  return cart;
};