const { Sequelize, DataTypes, ModelCtor } = require('sequelize');


/**
 * Model Product
 * @param {Sequelize} sequelize 
 * @returns {ModelCtor<any>}
 */

module.exports = (sequelize) => {

    const Product = sequelize.define('product', {

        id: {
            type: DataTypes.BIGINT(),
            autoIncrement: true,
            primaryKey: true
        },

        // brand: {
        //     type: DataTypes.STRING(50)    // TODO  A voir plus tard si on add également labels etcc...
        // },

        libelle: {
            type: DataTypes.STRING(20),
            required: true
        },

        description: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },

        stockagePlace: {
            type: DataTypes.STRING(20),
            required: true
        },

        quantity: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },

        minQuantity: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },

        maxQuantity: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },

        peremptionDate: {
            type: DataTypes.DATE,
            required: true
        },

        perissable: {
            type: DataTypes.BOOLEAN(),
            required: true
        },

        commentary: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

    }, {
        tableName: 'product',
        timestamps: true
    });
    return Product;
};