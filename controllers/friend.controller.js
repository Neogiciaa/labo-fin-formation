const { ErrorResponse } = require('../api-responses/error-response');
const { SuccessResponse } = require('../api-responses/success-response');
const { checkIfMailExists } = require('../services/user.service');
const friendService = require('../services/friend.service');
const { db } = require('../models')

const friendController = {

    getAll: async (req, res) => {

        const senderId = req.user.id;
        console.log("User qui es connecté !", senderId);

        const receiverId = await friendService.getAll(senderId)
        console.log("DATAS SUR LE COMPTE AJOUTER EN AMI ", receiverId);
        return receiverId;
    },

    addFriendRequest: async (req, res) => {

        // Récupération de l'id du user connecté
        const senderId = req.user.id;
        console.log('je suis le user connecté', senderId);

        // Récupération du mail recherché par le user 
        const { mail } = req.body;
        const receiverId = await checkIfMailExists(mail)


        if (!receiverId) {
            console.log("L'user recherché n'existe pas !");
            return null;
        }

        else {
            console.log("Je suis l'ami ajouté", receiverId)
            await friendService.addFriendRequest(senderId, receiverId);

            res.status(200).json("La demande d'ami a bien été envoyée");
        }
    },

    //TODO à faire après avoir résolu "addFriend"
    deleteFriend: async (req, res) => {

        const id = req.user.id;
        console.log('je suis le user connecté', id);


    },

    acceptFriendRequest: async (req, res) => {

        const receivers = req.user.id;
        console.log('je suis le user connecté', userId);

        const senders = req.body;

        console.log("ID DU COMPTE A RETROUVER -> ", mail);
        const friendId = await checkIfMailExists(mail)

        await userService.acceptFriendRequest(receivers, senders);
        res.status(200).json("Demande d'ami acceptée !")

    },

    declineFriendRequest: async (req, res) => {
        // TODO ui x2
    }

};

module.exports = friendController;