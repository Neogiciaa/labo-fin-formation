const { Sequelize, DataTypes, ModelCtor } = require('sequelize');


/**
 * Model MTM_house-user
 * @param {Sequelize} sequelize 
 * @returns {ModelCtor<any>}
 */

module.exports = (sequelize) => {

    const MTM_house_user = sequelize.define('MTM_house_user', {

        id: {
            type: DataTypes.BIGINT(),
            autoIncrement: true,
            primaryKey: true
        },

        hasAdmin: {
            type: DataTypes.BIGINT(),
            required: true,
        },

        hasResponsable: {
            type: DataTypes.BIGINT(),
            allowNull: true
        },

        hasGuest: {
            type: DataTypes.BIGINT(),
            allowNull: true
        },

    }, {
        tableName: 'MTM_house_user',
    });

    return MTM_house_user;
};