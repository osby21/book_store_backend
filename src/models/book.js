'use strict';
module.exports = (sequelize, DataTypes) => {
  const book = sequelize.define('book', {
    categoryId: DataTypes.INTEGER,
    subCategoryId: DataTypes.INTEGER,
    childCategoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    writer: DataTypes.STRING,
    preview: DataTypes.TEXT,
    gender: DataTypes.STRING,
    price: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    discountPer: DataTypes.INTEGER,
    discount: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    netPrice: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  book.associate = function(models) {
    // associations can be defined here
    models.book.belongsTo(models.subcategory, { foreignKey: 'subCategoryId' });
    models.book.hasMany(models.bookphoto, { foreignKey: 'bookId' });
    models.book.belongsTo(models.childcategory, { foreignKey: 'childCategoryId' }); 
    
  };
  return book;
};