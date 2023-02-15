const { ErrorResponse } = require('../api-responses/error-response');
const { SuccessResponse } = require('../api-responses/success-response');
const roleService = require('../services/house_user.service');

const house_userController = {

    add: async(req, res) => {
        // Récupérer l'id du user connecté
        const userConnected = req.user.id;

        // Vérifier s'il existe un lien entre l'utilisateur connecté et la maison sur laquelle on veut ajouter le rôle par défaut
        await roleService.relationExist();

        // Ajout du user en tant qu'admin par défaut à la création d'une nouvelle maison
        const roleCreated = await roleService.add(userConnected);

        // Envoi de la réponse
        res.location('api/role/' + roleCreated._id);
        res.status(201).json(new SuccessResponse(roleCreated), 201);

    }
};

module.exports = {
    house_userController
}