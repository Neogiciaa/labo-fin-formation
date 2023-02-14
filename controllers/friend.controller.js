const { ErrorResponse } = require('../api-responses/error-response');
const { SuccessResponse } = require('../api-responses/success-response');
const { checkIfMailExists } = require('../services/user.service');
const friendService = require('../services/friend.service');

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
        const userConnected = req.user.id;
        console.log('je suis le user connecté', userConnected);

        // Récupération du mail recherché par le user 
        const { mail } = req.body;
        const receiverId = await checkIfMailExists(mail);

        console.log("mail vérifié = ", mail);

        if (!receiverId) {
            res.send(new ErrorResponse("L'utiliseur n'existe pas !", 404));

            return;
        }

        const answer = await friendService.relationExist(userConnected, receiverId);

        if (!answer) {
            await friendService.addFriend(userConnected, receiverId);
            res.send(new SuccessResponse("La demande d'ami a bien été envoyée !", 200));
        }

        if (answer) {
            res.send(new ErrorResponse("Vous avez déja une demande d'ami en cours", 200));
        }

        // console.log("AddFriendRequest -- answer = true -- Demande d'ami acceptée"); A verifier si c'est pas mieux dans la methode Update ?
        // res.send(new SuccessResponse("Demande d'ami acceptée", 403)); //TODO capter l'ip du sender, la garder en DB et si plusieurs tentatives = bannissement !!! Bloquer l'accès pendant quelques secondes pour bloquer les requêtes intenpestives!
    },

    updateFriendStatus: async (req, res) => {
        const userId = req.user.id
        const data = req.validateData;
        const newStatus = data.isAccepted

        const senderId = await checkIfMailExists(data.mail);

        // Si checkIfMailExist ne me renvoie rien alors on stop tout
        if (!checkIfMailExists) {
            res.send("Personne n'a envoyé d'invitation");
        }

        // Récupération de l'id (en database) de la relation sur laquelle appliquée la MAJ
        const relationExist = await friendService.relationExist(userId, senderId);
        const relationIdToUpdate = relationExist.dataValues.id
        const isAcceptedTest = relationExist.dataValues.isAccepted


        console.log("relationtoUpdate !!", relationIdToUpdate, isAcceptedTest);

        // Si id = 0 ---> Aucune relation existante en DB
        if (relationIdToUpdate === 0) {
            res.send("Il n'y a aucune relation existante à mettre à jour");
        }

        if (relationIdToUpdate === "1" && isAcceptedTest === null) {
            console.log("Je peux update car le status es en attente !");
            await friendService.updateFriendStatus(relationIdToUpdate, data);

            if (newStatus === true) {
                res.send(new SuccessResponse("La demande d'ami a été acceptée", 200));
            }
            res.send(new SuccessResponse("La demande d'ami a été refusée", 200));
        }

    },

    //TODO à faire après avoir résolu "addFriend"
    deleteFriend: async (req, res) => {
        const id = req.user.id;
        console.log('je suis le user connecté', id);

    }

};

module.exports = friendController;