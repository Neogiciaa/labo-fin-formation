const { ErrorResponse } = require('../api-responses/error-response');
const { SuccessResponse } = require('../api-responses/success-response');
const houseService = require('../services/house.service');
const { checkIfGotOtherOne } = require('../services/house_user.service');
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

        // Récupération de la maison via son id
        const house = await houseService.getById(id);

        // Si aucune maison n'a été trouvée => 404
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

        console.log("Je suis la nouvelle maison -> ", houseCreated);
        
        // Récupération de l'id de la maison qui vient d'être crée
        const houseId = houseCreated.id;

        // Récupération de l'état de la propriété mainHouse de cette nouvelle maison
        const mainHouse = houseCreated.mainHouse;

        // Créer le lien entre la maison fraîchement crée et son utilisateur
        await house_userService.add(userConnected, houseId);

        // Vérifier si l'utilisateur à déjà au minimum 1 autre maison dans sa liste
        const userHasOtherHouseYet = await house_userService.checkIfGotOtherOne(userConnected);

        console.log("Je suis userHasOtherHouseYet -> ", userHasOtherHouseYet);

        console.log('Je suis la propriété mainHouse de la nouvelle maison -> ', mainHouse);

        console.log("JE SUIS LE 2e ELEMENT DU TABLEAU userHasOtherHouseYet, je suis undefined si user n'a pas d'autre maison -> ", userHasOtherHouseYet[1]);

        // Si la méthode checkIfGotOtherOne renvoie undefined, ça veut dire que je n'ai pas d'autre maison après avoir crée celle-ci donc la propriété mainHouse doit passer à "true" via une méthode update
        if (userHasOtherHouseYet[1] === undefined) {
            await house_userService.updateMainHouseStatus(houseId, mainHouse);
            console.log("J'entre dans la condition si je n'ai pas d'autre maison donc mainHouse = true", mainHouse);
        } else {
            console.log("J'ai déjà une autre maison donc celle-ci n'est pas ma principale donc mainHouse = false", mainHouse);
        }

        // Envoi de la réponse
        res.location('api/house/' + houseCreated._id);
        res.status(201).json(new SuccessResponse(houseCreated), 201);
    },

    update: async (req, res) => {
        // Récupération des infos du body (validé par le middleware)
        const data = req.validateData;

        // Récupération de l'id de la maison
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

        res.send("La maison a bien été supprimée");
    }
}

module.exports = houseController;