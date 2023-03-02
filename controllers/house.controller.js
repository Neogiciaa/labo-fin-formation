const { ErrorResponse } = require('../api-responses/error-response');
const { SuccessResponse } = require('../api-responses/success-response');
const houseService = require('../services/house.service');
const house_userService = require('../services/house_user.service');

const houseController = {

    getAllByUser: async (req, res) => {
        // Récupération de l'id du user connecté
        const userConnected = req.user.id;

        // Récupération des données via le service qui gère la table intermédiaire (relation entre user et house)
        const houses = await house_userService.getAllHouseByUser(userConnected);

        if (houses == undefined) {
            res.send("Vous n'avez encore crée aucune maison...");
            return;
        }

        // Envoi de la réponse
        res.json(new SuccessResponse(houses, 200));
    },

    getById: async (req, res) => {
        // Récupérer le user connecté
        const userId = req.user.id;
        // Récupération de l'id depuis la route
        const id = req.params.id;

        // Récupération de la maison via son id
        const house = await house_userService.getAllHouseByUser(userId);

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
        
        // Récupération de l'id de la maison qui vient d'être crée
        const houseId = houseCreated.id;

        // Créer le lien entre la maison fraîchement crée et son utilisateur
        await house_userService.add(userConnected, houseId);

        // Vérifier si l'utilisateur à déjà au minimum 1 autre maison dans sa liste
        const userHasOtherHouseYet = await house_userService.getAll(userConnected);

        // Si la méthode getAll ne renvoie qu'un seul élément (à l'index 0) et donc undefined à l'index 1, ça veut dire que je n'ai pas d'autre maison après avoir crée celle-ci donc la propriété mainHouse doit passer à "true" via une méthode update
        if (userHasOtherHouseYet[1] === undefined) {
            await houseService.updateMainHouseStatus(houseId);
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
        // Récupérer l'id params
        const id = req.params.id;

        // Appeller le service en lui passant l'id de l'élément à delete
        const deletedHouse = await houseService.delete(id);

        // Si deledHouse renvoie null, c'est que la maison qu'on cherche à supprimer n'existe pas.
        if (deletedHouse == null) {
            res.send(new ErrorResponse("La maison n'existe pas !", 404));
        }

        // Si la maison a bien été supprimé et qu'elle était considérée comme la Résidence Principale, il faut transférer ce status à la prochaine maison sur la liste
        

        res.send("La maison a bien été supprimée");
    }
}

module.exports = houseController;