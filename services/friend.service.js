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

    temporaryRelationExist: async (sender, receiver) => {

        if( receiver == undefined ) {
            return;
        }

        else {
            const isPendingRequest = await db.MTM_friendlistRequest.findOne({
                where: {
                    sender: {
                        [Op.or]: [sender, receiver]
                    },
                    receiver: {
                        [Op.or]: [receiver, sender]
                    }
                },
            });

            console.log("Je suis isPendingRequest -> ", isPendingRequest);
            return isPendingRequest;
        }
    },

    addFriendRequest: async (sender, receiver) => {

        console.log("sender -> ", sender);
        console.log("receiver -> ", receiver);

        await db.MTM_friendlistRequest.create({
            sender,
            receiver
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