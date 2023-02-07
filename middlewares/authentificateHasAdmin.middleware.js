const { decodeJWT } = require('../utils/jwt.utils');


/**
 * Middleware d'authentification via les JSON Web Token
 * @param {{isAdmin: boolean}} options 
 * @returns {(req: Request, res: Response, next: NextFunction) => Void}
 */

const authentificateHasAdmin = () => {

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
        
        else {
            // Récuperation des données du JWT
            let tokenData
            // Extraction des données
            tokenData = await decodeJWT(token).catch(_ => {
                // En cas d'erreur, envoi d'un erreur
                res.sendStatus(401)
            })

            if (tokenData.isAdmin) {
                console.log("je suis admin je fais ce que je veux")
                req.user = tokenData
                next()
            }

            else {
                console.log("Je ne suis pas admin ", tokenData.isAdmin);
                console.log("not admin access for this operation")
                res.sendStatus(403)
            }

        }
    }
};

module.exports = authentificateHasAdmin;
