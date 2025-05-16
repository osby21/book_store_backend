'use strict';
module.exports = (sequelize, DataTypes) => {
  const bookoffer = sequelize.define('bookoffer', {
    bookId: DataTypes.INTEGER,
    image: DataTypes.STRING,
    discount_per: DataTypes.STRING,
    discount_price: DataTypes.FLOAT,
    qty: DataTypes.INTEGER,
    total: DataTypes.FLOAT,
    net_price: DataTypes.FLOAT
  }, {});
  bookoffer.associate = function(models) {
    // associations can be defined here
    models.bookoffer.belongsTo(models.book, { foreignKey: 'bookId' });

  };
  return bookoffer;
};