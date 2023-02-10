const { Sequelize, DataTypes, ModelCtor } = require('sequelize');

/**
 * Model User
 * @param {Sequelize} sequelize 
 * @returns {ModelCtor<any>}
 */

module.exports = (sequelize) => {

    const User = sequelize.define('user', {

        id: {
            type: DataTypes.BIGINT(),
            autoIncrement: true,
            primaryKey: true
        },

        pseudo: {
            type: DataTypes.STRING(20),
            required: true,
            trim: true
        },

        lastName: {
            type: DataTypes.STRING(20),
            required: true,
            trim: true
        },

        firstName: {
            type: DataTypes.STRING(20),
            required: true,
            trim: true
        },

        mail: {
            type: DataTypes.STRING(50),
            required: true,
            unique: {
                name: 'UK_User__Mail'
            },
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },

        hashPassword: {
            type: DataTypes.CHAR(97),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        street: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        number: {
            type: DataTypes.INTEGER(10),
            allowNull: true
        },

        postalCode: {
            type: DataTypes.STRING(10),
            allowNull: true
        },

        city: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        country: {
            type: DataTypes.STRING(50),
            allowNull: true,
            trim: true
        },

        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'user',
        timestamps: true
    });

    // Définir les relations ! (Many to Many)
    User.belongsToMany(User, { as: "user", through: 'MTM_friendlist', foreignKey: "userId" });
    User.belongsToMany(User, { as: "friend", through: 'MTM_friendlist', foreignKey: "friendId" });


    return User;
};