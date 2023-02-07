const { Request, Response, NextFunction } = require('express');
const { BaseSchema } = require('yup');
const { InvalidBodyErrorResponse } = require('../api-responses/error-response');


/**
 * Fonction pour générer le middleware "bodyValidation"
 * @param {BaseSchema} validator Schema de validation "yup"
 * @param {Number} errorCode Code d'erreur si les données sont invalides
 * @returns {(req: Request, res: Response, next: NextFunction) => undefined}
 */
const bodyValidation = (validator, errorCode = 422) => {

    /**
     * Middleware de validation de body via "yup"
     * @param {Request} req 
     * @param {Response} res 
     * @param {NextFunction} next 
     */
    return (req, res, next) => {
        // Validation des données du body
        validator.noUnknown().validate(req.body, { abortEarly: false })
            .then((data) => {

                // Si les données sont valide

                // - Ajouter les données dans la propriété "validateData" de "req"
                req.validateData = data;

                console.log('Le BodyValidator confirme que les données sont valides !!!');

                // - Appel de la méthode "next" pour continuer le traitement
                next();
            })
            .catch((yupError) => {
                // Si les données sont invalide

                // - Créer un objet "errors" sur base des données de yup
                const validationErrors = {};
                for (const { path, message, type } of yupError.inner) {
                    // Customisation de l'objet qu'on souhaite renvoyer

                    if (validationErrors[path] === undefined) {
                        validationErrors[path] = [message];
                    }
                    else {
                        validationErrors[path].push(message);
                    }
                }

                // - Envoi une reponse d'erreur
                res.status(errorCode).json(new InvalidBodyErrorResponse(
                    'Data invalid',
                    validationErrors,
                    errorCode
                ));
            });
    };
};

module.exports = bodyValidation;