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

        console.log("relationExist is TRUE OR FALSE -> ", answer);

        if (answer === undefined) {
            console.log("AddFriendRequest -- answer = undefined -- Je crée la relation dès la demande", receiverId)
            await friendService.addFriend(userConnected, receiverId);
            res.send(new SuccessResponse("La demande d'ami a bien été envoyée !", 200));
        }

        if (answer === null) {
            console.log("Vous avez déjà une demande d'ami en cours");
            res.send(new ErrorResponse("Vous avez déjà une demande d'ami en cours", 200));
        }
            
        if (!answer) {
            console.log("AddFriendRequest -- answer = false -- Demande d'ami rejetée");
            res.send(new ErrorResponse("Demande d'ami rejeté", 200));
        }

        console.log("AddFriendRequest -- answer = true -- Demande d'ami acceptée");
        res.send(new SuccessResponse("Demande d'ami acceptée", 403)); //TODO capter l'ip du sender, la garder en DB et si plusieurs tentatives = bannissement !!! Bloquer l'accès pendant quelques secondes pour bloquer les requêtes intenpestives!
    },

    updateAnswerFromFuturFriend: async (req, res) => {
        const { isAccepted } = req.body;
        
        await friendService.updateAnswerFromFuturFriend(isAccepted);

        if (isAccepted === false) {
            console.log("Demande d'ami rejetée");
            res.send(new ErrorResponse("Demande d'ami rejeté", 200));

            return;
        }

        console.log("Je suis l'ami ajouté", receiverId)
        res.send(new SuccessResponse("Demande d'ami acceptée", 200));
    },
    
    //TODO à faire après avoir résolu "addFriend"
    deleteFriend: async (req, res) => {
        const id = req.user.id;
        console.log('je suis le user connecté', id);


    }

};

module.exports = friendController;