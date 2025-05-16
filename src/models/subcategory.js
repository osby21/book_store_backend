'use strict';
module.exports = (sequelize, DataTypes) => {
  const subcategory = sequelize.define('subcategory', {
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  subcategory.associate = function(models) {
    // associations can be defined here
    models.subcategory.belongsTo(models.category, { foreignKey: 'categoryId' });

  };
  return subcategory;
};