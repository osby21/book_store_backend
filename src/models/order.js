'use strict';
module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define('order', {
    custId: DataTypes.INTEGER,
    number: DataTypes.STRING,
    paymentmethod: DataTypes.STRING,
    deliverydate: DataTypes.DATE,
    grandtotal: DataTypes.INTEGER,
    status: DataTypes.ENUM('processing','shipping','delieverd','cancel'),
  }, {});
  order.associate = function(models) {
    // associations can be defined here
    models.order.hasMany(models.address, { foreignKey: 'orderId' });
    models.order.hasMany(models.cart, { foreignKey: 'orderId' });

    // models.Order.hasMany(models.payment, { foreignKey: 'orderCreationId' });  

  };
  return order;
};