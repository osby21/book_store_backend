'use strict';
module.exports = (sequelize, DataTypes) => {
    const pendingcustomer = sequelize.define('pendingcustomer', {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        phone: DataTypes.STRING,
        password: DataTypes.STRING,
        userid: DataTypes.STRING,
        gender: DataTypes.STRING,
        otp: DataTypes.STRING,
        expiresAt: DataTypes.DATE
    }, {});
    pendingcustomer.associate = function(models) {
      // associations can be defined here
    };
    return pendingcustomer;
};
    
