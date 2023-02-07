const { ErrorResponse } = require('../api-responses/error-response');
const { SuccessResponse } = require('../api-responses/success-response');
const productService = require('../services/product.service');

const productController = {

    getAll: async (req, res) => {
        // Récupération des données via le service
        const products = await productService.getAll();

        // Envoi de la réponse
        res.json(new SuccessResponse(products, 200));
    },

    getById: async (req, res) => {
        // Récuperation de l'id depuis la route
        const id = req.params.id;

        // Obtenir les infos de la track via le service
        const data = await productService.getById(id);

        // Si aucunne donnée => Erreur Not found (404)
        if (!data) {
            res.sendStatus(404);
            return;
        }

        // Envoi les données avec l'api reponse
        res.json(new SuccessResponse(data));
    },

    add: async (req, res) => {
        // Récupération des données validées par le middleware "bodyValidation"
        const data = req.validateData;

        // Ajout dans la DB
        const productCreated = await productService.add(data);

        // Envoi de la réponse

        res.location('api/product' + productCreated.id);
        res.status(201).json(new SuccessResponse(productCreated), 201);
    },

    update: async (req, res) => {
        const data = req.validateData;
        // Récupération de l'id
        const id = req.params.id;


        const productUpdated = await productService.update(id, data);

        if (!productUpdated) {
            res.sendStatus(404);
        }

        // Envoie de la réponse
        res.status(204).json(new SuccessResponse(productUpdated), 204);

    },

    delete: async (req, res) => {

        const id = req.params.id;

        const deletedProduct = await productService.delete(id);

        if (deletedProduct == null) {
            res.send(new ErrorResponse("Le produit n'existe pas !", 404));
        }

        res.send("Le produit a bien été supprimé !");
    }
};



module.exports = productController;