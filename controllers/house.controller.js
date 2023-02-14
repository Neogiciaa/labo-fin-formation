const { ErrorResponse } = require('../api-responses/error-response');
const { SuccessResponse } = require('../api-responses/success-response');
const houseService = require('../services/house.service');
const house_userService = require('../services/house_user.service');

const houseController = {

    getAll: async (req, res) => {
        // Récupération des données via le service
        const houses = await houseService.getAll();

        // Envoi de la réponse
        res.json(new SuccessResponse(houses, 200));
    },

    getById: async (req, res) => {
        // Récupération de l'id depuis la route
        const id = req.params.id;

        // Récupération du user via son id
        const house = await houseService.getById(id);

        // Si aucune house n'a été trouvé => 404
        if (house == null) {
            res.json(new ErrorResponse("La maison que vous recherchez n'existe pas !", 404));
            return;
        }

        // Envoi des données
        res.json(new SuccessResponse(house, 200));
    },

    add: async (req, res) => {
        // Récupération de l'id du user connecté
        const userConnected = req.user.id;

        // Récupération des données validées par le middleware "bodyValidation"
        const data = req.validateData;

        // Ajout dans la DB
        const houseCreated = await houseService.add(data);
        
        // Récupération de l'id de la maison qui vient d'être crée
        const houseId = houseCreated.id;

        // Créer le lien entre la maison fraîchement crée et son utilisateur
        await house_userService.add(userConnected, houseId);

        // Envoi de la réponse
        res.location('api/house/' + houseCreated._id);
        res.status(201).json(new SuccessResponse(houseCreated), 201);
    },

    update: async (req, res) => {
        // Récupération des infos du body (validé par le middleware)
        const data = req.validateData;

        // Récupération de l'id
        const id = req.params.id;

        // Mise à jour dans la DB
        const houseUpdated = await houseService.update(id, data);

        console.log('Je met à jour la DB', id, data);

        // Si l'élément est inexistant -> Error 404
        if (!houseUpdated) {
            res.sendStatus(404);
            return;
        }

        // Envoie de la réponse
        res.status(204).json(new SuccessResponse(houseUpdated), 204);
    },

    delete: async (req, res) => {
        const id = req.params.id;

        const deletedHouse = await houseService.delete(id);

        if (deletedHouse == null) {
            res.send(new ErrorResponse("La maison n'existe pas !", 404));
        }

        res.send("deletedHouse");
    }
}

module.exports = houseController;