const db = require('../models');
const { Op } = require('sequelize');

const house_userService = {

    getAll: async(user) => {
        // Récupération de toutes les maisons appartenant à l'utilisateur
        console.log("user ! ", user);

        const housesId = await db.MTM_house_user.findAll({
            where: { user }
        })

        return housesId;
    },

    add: async(userId, houseId) => {

        console.log("user -> ", userId);
        console.log("house -> ", houseId);

        const hasAdmin = userId;

        await db.MTM_house_user.create({
            userId,
            houseId,
            hasAdmin
        });

    },

    checkIfGotOtherOne: async (userId) => {
        //TODO Vérifier si je filtre bien la recherche via le userId !!
        const getAllHouseOfUserConnected = await db.MTM_house_user.findAll({
            where: {
                userId
            }
        });

        return getAllHouseOfUserConnected
    },
    //TODO TO FIX !!!
    updateMainHouseStatus: async (houseId, mainHouse) => {

        mainHouse = true;

        await db.House.update(mainHouse, {
            where: { houseId },
            validate: true,
            returning: true
        })
    }

}

module.exports = house_userService;