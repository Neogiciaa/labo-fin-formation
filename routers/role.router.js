const roleController = require('../controllers/role.controller');
const authentificate = require('../middlewares/authentificate.middleware');
//TODO EST-CE UTILE????
const roleRouter = require('express').Router();

// Récupération de tous les rôles des utilisateurs de la DB via le controller
// roleRouter.get('/', authentificate(), roleController.getAll);

// Ajout d'un rôle
// roleRouter.post('/', authentificate(), roleController.add);

// Changer le rôle d'un user
// roleRouter.put('/', authentificate(), roleController.update);

// // Supprimer un ami de sa liste d'ami
// friendRouter.delete('/friend/:id', authentificate(), friendController.deleteFriend);

// // Route ADMIN : suppression d'un compte utilisateur de l'application globable
// friendRouter.delete(':id', authentificateHasAdmin(), friendController.delete); //TODO vérifier la logique d'accès. Renvoie actuellement une 404 native lors d'un test

module.exports = roleRouter;