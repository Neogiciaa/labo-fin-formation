const { ErrorResponse } = require("../api-responses/error-response");
const { SuccessResponse } = require("../api-responses/success-response");

const authService = require("../services/auth.service");
const { generateJWT } = require("../utils/jwt.utils");

const authController = {

    register: async (req, res) => {
        // Récupération des infos du body (validé par le middleware)
        const { pseudo, lastName, firstName, mail, password } = req.validateData;

        // Appel du service
        const data = await authService.register(pseudo, lastName, firstName, mail, password);

        // Envoi de la réponse
        if (!data) {
            // Si compte déja existant alors error !
            res.status(400).json(new ErrorResponse("Cette adresse mail est déjà utilisée !"));
            return;
        }
        // Compte bien crée !
        res.sendStatus(204);
    },

    login: async (req, res) => {
        // Récupération des infos du body (validé par le middleware)
        const { mail, password } = req.validateData;

        // Appel du service
        const data = await authService.login(mail, password);

        // Erreur de login (mauvais email ou mauvais mot de passe)
        if (!data) {
            res.status(400).json(new ErrorResponse('Bad credential'));
            return;
        }

        // Génération du token
        try {

            const token = await generateJWT(data);

            // isConnected = true;

            // Envoi de la réponse
            res.status(200).json({ token }); // TODO .JSON du Token Ok pour débug mais probablement devoir le retirer au finish !!
        }
        catch (error) {
            res.status(500);
            console.log("hyfuazygeazaz");
        }
    }
};

module.exports = authController;