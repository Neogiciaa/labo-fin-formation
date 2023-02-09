const { DataTypes, Sequelize } = require('sequelize');

/**
 * Constructeur du modèle "MTM_friendlistRequest"
 * @param {Sequelize} sequelize
 */

module.exports = (sequelize) => {

    const MTM_friendlistRequest = sequelize.define('MTM_friendlistRequest', {

        sender: {
            type: DataTypes.STRING
        },

        receiver: {
            type: DataTypes.STRING
        },

        isAccepted: {
            type: DataTypes.BOOLEAN,
            default: null,
            allowNull: true
        }
    },
        {
            tableName: 'MTM_friendlistRequest',
            timestamps: true,
            updatedAt: true
        });

    return MTM_friendlistRequest;
}