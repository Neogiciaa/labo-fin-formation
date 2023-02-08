const { ErrorResponse } = require('../api-responses/error-response');
const { SuccessResponse } = require('../api-responses/success-response');
const { checkIfMailExists } = require('../services/user.service');
const userService = require('../services/user.service');

const userController = {

    getAll: async (req, res) => {
        // Récupération des données via le service
        const users = await userService.getAll();

        // Envoi de la réponse
        res.json(new SuccessResponse(users, 200));
    },

    getById: async (req, res) => {
        // Récupération de l'id depuis la route
        const id = req.params.id;

        // Récupération du user via son id
        const user = await userService.getById(id);

        // Si aucun user n'a été trouvé => 404
        if (user == null) {
            res.json(new ErrorResponse("L'utilisateur que vous recherchez n'existe pas !", 404));
            return;
        }

        // Envoi des données
        res.json(new SuccessResponse(user, 200));
    },

    add: async (req, res) => {
        // Récupération des données validées par le middleware "bodyValidation"
        const data = req.validateData;

        // Ajout dans la DB
        const userCreated = await userService.add(data);

        // Envoi de la réponse
        res.location('api/user/' + userCreated._id);
        res.status(201).json(new SuccessResponse(userCreated), 201);
    },

    update: async (req, res) => {
        // Récupération des infos du body (validé par le middleware)
        const data = req.validateData;
        console.log('Je passe dans update du controller');

        // Récupération de l'id
        const id = req.params.id;

        if (data.mail) {

            const originalUser = await userService.getById(id);
            const mailHasModified = originalUser?.mail?.toLowerCase() === data.mail.toLowerCase();


            // Tester si le mail es unique avant l'ajout
            if (mailHasModified && await userService.checkIfMailExists(data.mail)) {
                console.log('Je suis dans le if de vérification mail existe ou non !');
                res.status(400).json(new ErrorResponse(
                    `The mail "${data.mail}" already exists !`
                ));
                console.log(data.mail);
                return;
            }
        };

        console.log('Je ne passe pas dans le if');

        // Mise à jour dans la DB
        const userUpdated = await userService.update(id, data);

        console.log('Je met à jour la DB', id, data);

        // Si l'élément est inexistant -> Error 404
        if (!userUpdated) {
            console.log("userUpdated = false");
            res.sendStatus(404);
            return;
        }

        // Envoie de la réponse
        res.status(204).json(new SuccessResponse(userUpdated), 204);
        console.log(userUpdated);
    },

    delete: async (req, res) => {

        const id = req.params.id;

        const deletedUser = await userService.delete(id);

        if (deletedUser == null) {
            res.send(new ErrorResponse("L'utiliseur n'existe pas !", 404));
        } 
        
        else {
            res.send("Le compte a bien été supprimé !");
        }
    },

    addFriend: async (req, res) => {

        // Récupération de l'id du user connecté
        const id = req.user.id;
        console.log('je suis le user connecté', id);

        // Récupération du mail recherché par le user 
        const { mail } = req.body;
        const idFriend = await checkIfMailExists(mail)


        if (!idFriend) {
            console.log("L'user recherché n'existe pas !");
            return null;
        }

        else {
            console.log("Je suis l'ami ajouté", idFriend)
            await userService.addFriend(id, idFriend);

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

module.exports = userController;