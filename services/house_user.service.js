const db = require('../models');
const { Op } = require('sequelize');
const houseService = require('./house.service');
const { HouseDTO } = require('../dto/house.dto');

const house_userService = {

    getAll: async(userId) => {
        // Récupération de toutes les relations house_user via le userId
        const house_user = await db.MTM_house_user.findAll({
            where: { userId }
        })

        console.log(house_user);

        return house_user;
    },

    getAllHouseByUser: async(userId) => {
        // Récupération de toutes les relations existantes de l'utilisateur avec les maisons qu'il a potentiellement crée.
        const house_user = await house_userService.getAll(userId);

        console.log("getAllHouseByUser a check la table intermédiaire");

        // Récupérer l'id de toutes les maisons liées à l'utilisateur via un mapping
        const housesId = house_user.map(house_user => house_user.dataValues.houseId); // house_user.dataValues.houseId

        console.log("housesId -> ", housesId);

        // Si la longueur du tableau récupéré juste avant est inférieur à 1, c'est qu'aucune maison n'a été trouvée
        if (housesId.length < 1) {

            return;
        }

        // Créer un nouveau tableau qui va recevoir toutes les HouseDTO
        const allHouseByUser = [];

        // Boucler sur le tableau des housesId et envoyer chacun d'entre eux dans la fonction qui récupère chaque maison via son id
        for (let i = 0; i < housesId.length; i++) {
            let element = housesId[i];
            allHouseByUser.push(await houseService.getById(element));
        }

        // Retourner un nouveau HouseDTO pour chaque élément du tableau via un mapping
        return {
            houses : allHouseByUser.map(allHouseByUser => new HouseDTO(allHouseByUser))
        }
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

    // checkIfGotOtherOne: async (userId) => {
    //     const getAllHouseOfUserConnected = await db.MTM_house_user.findAll({
    //         where: {
    //             userId
    //         }
    //     });

    //     return getAllHouseOfUserConnected;
    // }

}

module.exports = house_userService;