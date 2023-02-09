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
        const senderId = req.user.id;
        console.log('je suis le user connecté', senderId);

        // Récupération du mail recherché par le user 
        const { mail } = req.body;
        const receiverId = await checkIfMailExists(mail);

        // const relationExist = await friendService.getAll(senderId, receiverId);

        const isPendingRequest = await friendService.temporaryRelationExist(senderId, receiverId)

        if (!receiverId) {
            console.log("L'user recherché n'existe pas !");
            // res.sendStatus(404);
            // return;

            res.send(new ErrorResponse("L'utiliseur n'existe pas !", 404));
            return;
        }

        // Code a tester lorsque la méthode accept/decline request sera fonctionelle
        // if (relationExist !== null) {
        //     console.log("Vous êtes déja en amis !");
        //     res.send(new ErrorResponse("Vous êtes déja amis !", 404));
        //     return; 
        // }

        if (isPendingRequest !== null) {
            console.log("Vous avez deja une demande d'ami en cours");
            res.send(new ErrorResponse("Vous avez déja une demande d'ami en cours", 404));
            return;
        }
        // TODO Clean code à faire --> If Else ?
        if (isPendingRequest == null) { // "relationExist == null &&" a add dans les conditions !

            console.log("Je suis l'ami ajouté", receiverId)
            await friendService.addFriendRequest(senderId, receiverId);
            res.send(new SuccessResponse("La demande d'ami a bien été envoyée!", 200));
        }

    },
    
    acceptFriendRequest: async (req, res) => {
        
        const receiver = req.user.id;
        console.log('je suis le user connecté', receiver);

        const { mail } = req.body;

        console.log("ID DU COMPTE A RETROUVER -> ", mail);
        const sender = await checkIfMailExists(mail);

        await friendService.acceptFriendRequest(receiver, sender);
        res.send(new SuccessResponse("Demande d'ami acceptée", 200));
    },

    declineFriendRequest: async (req, res) => {

        const receiver = req.user.id;
        console.log('je suis le user connecté', receiver);

        const { mail } = req.body;

        console.log("ID DU COMPTE A RETROUVER -> ", mail);
        const sender = await checkIfMailExists(mail);

        await friendService.acceptFriendRequest(receiver, sender);
        res.send(new SuccessResponse("Demande d'ami acceptée", 200));
    },
        //TODO à faire après avoir résolu "addFriend"
    deleteFriend: async (req, res) => {

        const id = req.user.id;
        console.log('je suis le user connecté', id);


    },

};

module.exports = friendController;