const { ErrorResponse } = require('../api-responses/error-response');
const { SuccessResponse } = require('../api-responses/success-response');
const { checkIfMailExists } = require('../services/user.service');
const friendService = require('../services/friend.service');

const friendController = {

    getAll: async (req, res) => {
        const userConnected = req.user.id;
        console.log("User qui es connecté", userConnected);

        const friends = await friendService.getAll(userConnected);

        res.json(new SuccessResponse(friends), 200)
    },

    addFriendRequest: async (req, res) => {
        // Récupération de l'id du user connecté
        const userConnected = req.user.id;
        console.log('je suis le user connecté', userConnected);

        // Récupération du mail recherché par le user 
        const { mail } = req.body;
        const receiverId = await checkIfMailExists(mail);

        console.log("mail vérifié = ", mail);

        // Si l'utilisateur qu'on essaie de demander en ami n'existe pas alors on stop tout
        if (!receiverId) {
            res.send(new ErrorResponse("L'utiliseur n'existe pas !", 404));

            return;
        }
        // Si le user connecté essaie de s'envoyer une demande d'ami alors on stop tout
        if (receiverId === userConnected) {
            res.send(new ErrorResponse("Vous ne pouvez pas vous ajouter en ami vous-même"));

            return;
        }

        // Récupération de la relation d'ami existante en db
        const answer = await friendService.relationExist(userConnected, receiverId);

        if (!answer) {
            await friendService.addFriend(userConnected, receiverId);
            res.send(new SuccessResponse("La demande d'ami a bien été envoyée !", 200));
        }

        // Récupération de l'état du booléen de la demande d'ami ciblée
        const requestStatus = answer.dataValues.isAccepted

        if (answer && requestStatus === null) {
            res.send(new ErrorResponse("Vous avez déja une demande d'ami en cours", 200));
        }

        if (answer && requestStatus === true) {
            res.send(new ErrorResponse("Vous êtes déja amis !"))
        }

        if (answer && requestStatus === false) {
            res.send(new ErrorResponse("Une demande d'ami précédente a été rejetée, veuillez réessayer plus tard"))
        }
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

        if (relationIdToUpdate === "1" && isAcceptedTest === null && newStatus === true) {
            console.log("Je peux accepter car le status es en attente et l'user accepte !");
            await friendService.updateFriendStatus(relationIdToUpdate, data);

            res.send(new SuccessResponse("La demande d'ami a été acceptée", 200));
        }

        if (relationIdToUpdate === "1" && isAcceptedTest === null && newStatus === false) {
            console.log("Je refuse la demande d'ami");
            await friendService.updateFriendStatus(relationIdToUpdate, data);

            res.send(new SuccessResponse("La demande d'ami a été refusée", 200));
        }



        if (relationIdToUpdate === "1" && isAcceptedTest === true && newStatus === false) {
            await friendService.deleteFriend(relationIdToUpdate)

            res.send(new SuccessResponse("L'ami a été viré comme un nanard"))
        }
        res.send(new ErrorResponse("Tu n'a rien a faire ici !"))
    }
};

module.exports = friendController;