const { Sequelize, DataTypes, ModelCtor } = require('sequelize');


/**
 * Model House
 * @param {Sequelize} sequelize 
 * @returns {ModelCtor<any>}
 */

module.exports = (sequelize) => {

    const House = sequelize.define('house', {

        id: {
            type: DataTypes.BIGINT(),
            autoIncrement: true,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING(100),
            required: true
        },

        street: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        number: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },

        postalCode: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },

        city: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        country: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        mainHouse: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }

    }, {
        tableName: 'house',
        timestamps: true
    });
    return House;
};