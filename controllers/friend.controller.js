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
        console.log("Verification si le lien d'amitié existe ou non sur la table", answer, userConnected, receiverId);

        console.log("relationExist is TRUE OR FALSE -> ", answer);

        if (answer === "Aucune relation trouvée") {
            console.log("AddFriendRequest -- answer = undefined -- Je crée la relation dès la demande", receiverId)
            await friendService.addFriend(userConnected, receiverId);
            res.send(new SuccessResponse("La demande d'ami a bien été envoyée !", 200));

            return;
        }

        if (answer === "Vous avez déja une demande d'ami en cours") {
            console.log("Vous avez déjà une demande d'ami en cours");
            res.send(new ErrorResponse("Vous avez déjà une demande d'ami en cours", 200));

            return;
        }

        if (answer === "Is Accepted es a True donc vous êtes déja amis") {
            console.log("Vous êtes déja amis !");
            res.send(new ErrorResponse("Vous êtes amis", 200));

            return;
        }

        // console.log("AddFriendRequest -- answer = true -- Demande d'ami acceptée"); A verifier si c'est pas mieux dans la methode Update ?
        // res.send(new SuccessResponse("Demande d'ami acceptée", 403)); //TODO capter l'ip du sender, la garder en DB et si plusieurs tentatives = bannissement !!! Bloquer l'accès pendant quelques secondes pour bloquer les requêtes intenpestives!
    },

    updateAnswerFromFuturFriend: async (req, res) => {
        const userId = req.user.id
        const { mail, isAccepted } = req.body;
        const senderId = await checkIfMailExists(mail);

        // const answer 



        console.log("Friend Id (Celui qui a envoyé la demande) -> ", senderId);

        // if (friendsId === null) {
        //     console.log("Friend Id === null", friendsId);   // NE SERS PROBABLEMENT PLUS ??
        //     res.send(new ErrorResponse("Il n'y a pas de demande d'ami en cours, tu n'es pas censé être la !"));
        // }

        const relationExist = await friendService.relationExist(userId, senderId);

        if (relationExist === "Aucune relation trouvée") {
            res.send(new ErrorResponse("Aucune demandes d'amis ne te concernent!"));

            return;
        }

        if (relationExist === "Vous avez déja une demande d'ami en cours") {
            console.log("Status de la demande -> En cours");
            res.send(new ErrorResponse("Status de votre demande -> En cours"));

            return;
        }

        if (relationExist === "Is Accepted es a True donc vous êtes déja amis") {
            console.log("Status de la demande -> Validée");
            res.send(new ErrorResponse("Status de votre demande -> Validée"));

            return;
        }

        if (relationExist === "Is Accepted es a false") {
            console.log("Status de la demande -> Rejetée");
            res.send(new SuccessResponse("Status de votre demande -> Rejetée", 200));

            return;
        }

        await friendService.updateAnswerFromFuturFriend(userId, senderId, isAccepted);

        console.log("Mise a jour de la demande d'ami", userId, senderId, isAccepted)
        res.send(new SuccessResponse("Demande d'ami mise a jour", 200));
    },

    //TODO à faire après avoir résolu "addFriend"
    deleteFriend: async (req, res) => {
        const id = req.user.id;
        console.log('je suis le user connecté', id);


    }

};

module.exports = friendController;