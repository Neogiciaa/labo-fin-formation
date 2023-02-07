const db = require('../models');
const { Op } = require('sequelize');

const friendService = {

    getAll: async (sender, receiver) => {
        console.log("Sender ! ", sender);
        const friends = await db.MTM_friendlist.findOne({
            where: {
                sender: {
                    [Op.or]: [sender, receiver]
                },
                receiver: {
                    [Op.or]: [receiver, sender]
                }
            }
        })
        return friends;
    },

    addFriendRequest: async (sender, receiver) => {

        await db.MTM_friendlist.create({
            sender,
            receiver,
            isAccepted
        });
    },

    deleteFriend: async (userId, friendId) => {
        // TODO Supprimer le lien entre deux amis :(
    },

    acceptFriendRequest: async (userId, friendId, isAccepted) => {

        let user = await db.MTM_friendlist.findOne({
            where: { friendId, userId }
        })

        console.log(" !", user);
        user.dataValues.isAccepted = true

        user.update(isAccepted)
            .then((res) => {
                isAccepted = true;
                console.log("IS ACCEPTED OR NOT ?", isAccepted);
            })
            .catch((error) => {
                console.log(error);
            });
    },

    declineFriendRequest: async (userId, friendId) => {

    }
};

module.exports = friendService