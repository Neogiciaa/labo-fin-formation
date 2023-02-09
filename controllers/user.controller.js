const { ErrorResponse } = require('../api-responses/error-response');
const { SuccessResponse } = require('../api-responses/success-response');
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

        // Récupération de l'id
        const id = req.params.id;

        if (data.mail) {

            const originalUser = await userService.getById(id);
            const mailHasModified = originalUser?.mail?.toLowerCase() === data.mail.toLowerCase();


            // Tester si le mail es unique avant l'ajout
            if (mailHasModified && await userService.checkIfMailExists(data.mail)) {
        
                res.status(400).json(new ErrorResponse(
                    `The mail "${data.mail}" already exists !`
                ));
                return;
            }
        };

        // Mise à jour dans la DB
        const userUpdated = await userService.update(id, data);

        // Si l'élément est inexistant -> Error 404
        if (!userUpdated) {

            res.sendStatus(404);
            return;
        }

        // Envoie de la réponse
        res.status(204).json(new SuccessResponse(userUpdated), 204);
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
    }

};

module.exports = userController;