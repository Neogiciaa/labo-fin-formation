const { decodeJWT } = require('../utils/jwt.utils');

/**
 * Middleware d'authentification via les JSON Web Token
 * @param {{userOnly: boolean}} options
 * @returns {(req: Request, res: Response, next: NextFunction) => Void}
 */

const accessUserOnly = (options = {userOnly : true}) => {

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
            console.log("Error authentificate middleware -> ", error);
            return res.sendStatus(403);
        }

        console.log("tokenData.id -> ", tokenData.id);
        console.log("req.user.id -> ", req.user.id);

        if (options.userOnly && tokenData.id === req.user.id) {
            console.log("userOnly -> ", options.userOnly);
            req.user = tokenData;
            console.log("req.user -> ", req.user);
            next();
        }
        
        else {
            console.log("userOnly -> ", options.userOnly);
            return res.sendStatus(403);
        }

    };
};

module.exports = accessUserOnly;
