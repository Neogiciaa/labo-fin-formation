const { Sequelize, DataTypes, ModelCtor } = require('sequelize');


/**
 * Model HouseToUser
 * @param {Sequelize} sequelize 
 * @returns {ModelCtor<any>}
 */

module.exports = (sequelize) => {

    const HouseToUser = sequelize.define('house_user', {

        hasAdmin: {
            type: DataTypes.STRING(50),
            required: true
        },

        hasResponsable: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        hasGuest: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

    }, {
        tableName: 'house_user',
    });

    return HouseToUser;
};