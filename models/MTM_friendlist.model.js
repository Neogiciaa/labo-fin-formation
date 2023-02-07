const { DataTypes, Sequelize } = require('sequelize');

/**
 * Constructeur du modèle "MTM_friendlist"
 * @param {Sequelize} sequelize
 */

module.exports = (sequelize) => {

    const MTM_friendlist = sequelize.define('MTM_friendlist', {

        sender: {
            type: DataTypes.STRING
        },

        receiver: {
            type: DataTypes.STRING
        }
    },
        {
            tableName: 'MTM_friendlist',
            timestamps: true,
            updatedAt: true
        });

    return MTM_friendlist;
}