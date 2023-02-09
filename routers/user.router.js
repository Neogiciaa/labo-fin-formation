const userController = require('../controllers/user.controller');
const bodyValidation = require('../middlewares/body-validation.middleware');
const { profilOptionsValidator } = require('../validators/user.validator');
const authentificate = require('../middlewares/authentificate.middleware');

//TODO Toutes les routes users sont OK !! Implémenter l'autorisation d'intégarir avec TOUS les comptes en tant qu'ADMIN !

const userRouter = require('express').Router();

// Récupération de tous les utilisateurs de la DB
userRouter.get('/', authentificate(), userController.getAll)

// Récupération d'un utilisateur via son id pour afficher ses infos
userRouter.get('/:id', authentificate(), userController.getById)

// Mise à jour des données personnelles du profil utilisateur
userRouter.put('/:id', authentificate(), bodyValidation(profilOptionsValidator), userController.update)

// Suppression d'un compte utilisateur de l'application globable
userRouter.delete('/:id', authentificate(), userController.delete);


module.exports = userRouter;