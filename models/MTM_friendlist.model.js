const { DataTypes, Sequelize } = require('sequelize');

/**
 * Constructeur du modèle "MTM_friendlist"
 * @param {Sequelize} sequelize
 */

module.exports = (sequelize) => {

    const MTM_friendlist = sequelize.define('MTM_friendlist', {

        id: {
            type: DataTypes.BIGINT(),
            autoIncrement: true,
            primaryKey: true
        },

        user: {
            type: DataTypes.STRING
        },

        friend: {
            type: DataTypes.STRING
        },

        isAccepted: {
            type: DataTypes.BOOLEAN,
            default: null,
            allowNull: true
        }
    },
        {
            tableName: 'MTM_friendlist',
            timestamps: true,
            updatedAt: true
        });

    return MTM_friendlist;
}