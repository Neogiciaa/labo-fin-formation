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

    addFriend: async (user, friend) => {

        console.log("user -> ", user);
        console.log("newFriend -> ", friend);

        await db.MTM_friendlist.create({
            user,
            friend
        });
    },

    updateAnswerFromFuturFriend: async (isAccepted) => {
        
        console.log("La réponse du futur ami est: ", isAccepted);

        await db.MTM_friendlist.update({
            isAccepted
        })
    },

        // let user = await db.MTM_friendlist.findOne({
        //     where: { friendId, userId }
        // })

        // console.log(" !", user);
        // user.dataValues.isAccepted = true

        // user.update(isAccepted)
        //     .then((res) => {
        //         isAccepted = true;
        //         console.log("IS ACCEPTED OR NOT ?", isAccepted);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });

    deleteFriend: async (user, friendToDelete) => {

        console.log("user -> ", user);
        console.log("friendToDelete -> ", friendToDelete);

        await db.MTM_friendlist.destroy({
            user,
            friend
        });
    },

    relationExist: async (user, friend) => {

        const isPendingRequest = await db.MTM_friendlist.findOne({
            where: {
                user: {
                    [Op.or]: [user, friend]
                },
                friend: {
                    [Op.or]: [friend, user]
                }
            },
        });

        console.log("Je suis isPendingRequest AVANT d'être vérifier par les IF -> ", isPendingRequest);

        if (isPendingRequest === null) {
            console.log("Je suis isPendingRequest = null -> ", isPendingRequest);

            return;
        }

        console.log("Je suis le status de la demande isAccepted -> ", isPendingRequest.dataValues.isAccepted);
        return isPendingRequest.dataValues.isAccepted;
    },
};

module.exports = friendService