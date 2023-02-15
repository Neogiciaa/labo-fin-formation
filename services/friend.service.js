const db = require('../models');
const { Op } = require('sequelize');
const { UserDTO } = require('../dto/user.dto');

const friendService = {

    getAll: async (user) => {
        // uUtiliser User pour chercher les relations qui lui appartiennent !

        // Récupérer des amis
        const friend = await db.MTM_friendlist.findAll();

        // Envoie des données dans un objet DTO
        return {
            friends: friend.map(friend => new UserDTO(friend))
        }

    },

    addFriend: async (user, friend) => {

        console.log("user -> ", user);
        console.log("newFriend -> ", friend);

        await db.MTM_friendlist.create({
            user,
            friend
        });
    },

    updateFriendStatus: async (id, data) => {

        if (!data) {
            throw new Error('Data is required');
        }

        await db.MTM_friendlist.update(data, {
            where: { id },
            validate: true,
            returning: true
        });

    },

    deleteFriend: async (relationIdToUpdate) => {

        console.log("RelationIDtoupdate", relationIdToUpdate);

        await db.MTM_friendlist.destroy({
            where: {
                id: relationIdToUpdate
            }
        });
    },

    relationExist: async (user, friend) => {

        const relationExist = await db.MTM_friendlist.findOne({
            where: {
                user: {
                    [Op.or]: [user, friend]
                },
                friend: {
                    [Op.or]: [friend, user]
                }
            },
        });

        console.log("Je suis relationExist AVANT d'être vérifier par les IF -> ", relationExist);

        if (relationExist === null) {
            console.log("Je suis relationExist = null -> ", relationExist);

            return false;
        }

        console.log("RELATION ID ->", relationExist.dataValues.id);

        return relationExist;

        // if (relationExist.dataValues.isAccepted === null) {
        //     console.log("Je suis le status isAccepted de la relation = null -> ", relationExist.dataValues.isAccepted);

        //     return relationExist.dataValues.isAccepted;
        // }


        // if (relationExist.dataValues.isAccepted === true) {
        //     console.log("Je suis le status isAccepted de la relation = true -> ", relationExist.dataValues.isAccepted);

        //     return "isAccepted est à True donc vous êtes déja amis";
        // }

        // if (relationExist.dataValues.isAccepted === false) {
        //     console.log("Je suis le status isAccepted de la relation = false -> ", relationExist.dataValues.isAccepted);

        //     return "isAccepted est à false, invitation refusée";
        // }
    },
};

module.exports = friendService