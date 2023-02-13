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

    updateAnswerFromFuturFriend: async (userId, senderId, isAccepted) => {

        const request = await db.MTM_friendlist.findOne(userId, senderId)
        console.log("La réponse du futur ami (Qui viens du body de la requête) est: ", isAccepted);

        await db.MTM_friendlist.update({
            isAccepted
        })
        console.log("Requete visée par l'update", request);
        return request;
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

            return "Aucune relation trouvée";
        }

        if (relationExist.dataValues.isAccepted === null) {
            console.log("Je suis le status isAccepted de la relation = null -> ", relationExist.dataValues.isAccepted);

            return "Vous avez déja une demande d'ami en cours";
        }

        if (relationExist.dataValues.isAccepted === true) {
            console.log("Je suis le status isAccepted de la relation = true -> ", relationExist.dataValues.isAccepted);

            return "Is Accepted es a True donc vous êtes déja amis";
        }

        if (relationExist.dataValues.isAccepted === false) {
            console.log("Je suis le status isAccepted de la relation = false -> ", relationExist.dataValues.isAccepted);

            return "Is Accepted es a false";
        }


        console.log("Je suis la relation a verifier -> ", relationExist);
        return relationExist;
    },

    getFriendsIdFromRequestFriend: async (requestFriendId) => {
        const friend = await db.MTM_friendlist.findOne({
            where: {
                id: requestFriendId
            }
        })
        console.log("Friend ! ", friend);
        return friend; // renvoie friend.dataValues.friend ??
    }
};

module.exports = friendService