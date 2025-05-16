'use strict';
module.exports = (sequelize, DataTypes) => {
  const childcategory = sequelize.define('childcategory', {
    categoryId: DataTypes.INTEGER,
    subCatId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  childcategory.associate = function(models) {
    // associations can be defined here
    models.childcategory.belongsTo(models.category, { foreignKey: 'categoryId' });

  };
  return childcategory;
};