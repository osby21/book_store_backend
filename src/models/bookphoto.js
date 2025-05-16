'use strict';
module.exports = (sequelize, DataTypes) => {
  const bookphoto = sequelize.define('bookphoto', {
    bookId: DataTypes.INTEGER,
    imgUrl: DataTypes.STRING
  }, {});
  bookphoto.associate = function(models) {
    // associations can be defined here
    models.bookphoto.belongsTo(models.book, { foreignKey: 'bookId' });

  };
  return bookphoto;
};