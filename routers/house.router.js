const houseController = require('../controllers/house.controller');
const bodyValidation = require('../middlewares/body-validation.middleware');
const { houseValidator } = require('../validators/house.validator');
const authentificate = require('../middlewares/authentificate.middleware');


const houseRouter = require('express').Router();

// TODO Récupération de toutes les maisons de l'app. Utile pour les phases de test mais peut-être à supprimer pour le build finale ??
houseRouter.get('/', authentificate(), houseController.getAllByUser)

// Récupération des maisons via leur id (lié au compte utilisateur) afin d'afficher sa liste de maison
houseRouter.get('/:id', authentificate(), houseController.getById)

// Ajouter une maison dans mon app
houseRouter.post('/', authentificate(), bodyValidation(houseValidator), houseController.add)

// Mise à jour des données de la maison (nom et addresse)
houseRouter.put('/:id', authentificate(), bodyValidation(houseValidator), houseController.update)

// Supprimer une maison de ma liste
houseRouter.delete('/:id', authentificate(), houseController.delete);


module.exports = houseRouter;