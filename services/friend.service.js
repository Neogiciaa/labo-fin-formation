const db = require('../models');
const { Op } = require('sequelize');
const { UserDTO } = require('../dto/user.dto');

const friendService = {
    //TODO utiliser le paramètre "user" pour filter le findAll
    getAll: async (user) => {
        // Récupérer des amis
        const friend = await db.MTM_friendlist.findAll({
            where: {
                user
            }
        });

        // Envoi des données dans un objet DTO
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
    },
};

module.exports = friendService