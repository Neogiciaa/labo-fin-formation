const db = require('../models');
const { Op, Sequelize } = require('sequelize');
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

        await db.MTM_friendlist.destroy({
            where: {
                id: relationIdToUpdate
            }
        });
    },

    setTimeOut: async (relationIdToUpdate) => {
        const oneMinute = 60000;
        const time = oneMinute * 0.5 // 30s pour tests !
        setTimeout(async () => {
            await friendService.deleteFriend(relationIdToUpdate);
        }, time);

        return;
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

        if (relationExist === null) {

            return false;
        }

        return relationExist;
    }
};

module.exports = friendService