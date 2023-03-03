const houseController = require('../controllers/house.controller');
const { houseValidator } = require('../validators/house.validator');
const bodyValidation = require('../middlewares/body-validation.middleware');
const authentificate = require('../middlewares/authentificate.middleware');
const accessUserOnly = require('../middlewares/accessUserOnly.middleware');


const houseRouter = require('express').Router();

// Récupération de toutes les maisons de l'utilisateur. Utile pour les phases de test mais peut-être à supprimer pour le build finale ??
houseRouter.get('/', authentificate(), accessUserOnly(), houseController.getAllByUser)

// Récupération des maisons via leur id (lié au compte utilisateur) afin d'afficher sa liste de maison
houseRouter.get('/:id', authentificate(), houseController.getByIdByUser) //TODO implémenter les rôles !!

// Ajouter une maison dans mon app
houseRouter.post('/', authentificate(), accessUserOnly(), bodyValidation(houseValidator), houseController.add)

// Mise à jour des données de la maison (nom et addresse)
houseRouter.put('/:id', authentificate(), accessUserOnly(), bodyValidation(houseValidator), houseController.update)

// Supprimer une maison de ma liste
houseRouter.delete('/:id', authentificate(), accessUserOnly(), houseController.delete);


module.exports = houseRouter;