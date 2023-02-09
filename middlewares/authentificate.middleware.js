const { decodeJWT } = require('../utils/jwt.utils');


/**
 * Middleware d'authentification via les JSON Web Token
 * @param {{adminOnly: boolean}} options 
 * @returns {(req: Request, res: Response, next: NextFunction) => Void}
 */

const authentificate = (options = { adminOnly: true }) => {

    /** 
       * Middleware pour gérer les jwt
       * @param { Request } req
       * @param { Response } res
       * @param { NextFunction } next
       */

    return async (req, res, next) => {
        // Récuperation du header d'authenfication
        // -> Exemple de résultat: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
        const authHeader = req.headers['authorization']

        // Récuperation du JWT
        const token = authHeader && authHeader.split(' ')[1]

        // Si aucun token n'a été recu, erreur 401.
        if (!token) {
            console.log("aucun token recu, erreur 401.")
            return res.sendStatus(401)
        }

        // Récuperation des données du JWT
        let tokenData;

        try {
            // Extraction des données
            tokenData = await decodeJWT(token);

        }
        catch (error) {
            // En cas d'erreur, envoi d'un erreur
            return res.sendStatus(403);
        }

        //TODO implémenter les droits administrateur (plein pouvoir sur l'app) dans un futur si on estime cela utile

        // Vérification des droits de l'utilisateur si le flag "adminOnly" est présent
        // if (options.adminOnly && !tokenData.isAdmin) {
        //     console.log("adminOnly = ", options.adminOnly);
        //     console.log("isAdmin = ", tokenData.isAdmin);
        //     // Erreur 403 si l'utilisateur n'a pas les droits
        //     return res.sendStatus(403);
        // }

        // next();

        if ((tokenData.id && req.params.id === undefined) || (tokenData.id === req.params.id)) {
            
            req.user = tokenData;
            next();
        } 
        
        else {

            return res.sendStatus(403);
        }

    };
};

module.exports = authentificate;
