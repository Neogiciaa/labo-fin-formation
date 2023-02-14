const friendController = require('../controllers/friend.controller');
const authentificate = require('../middlewares/authentificate.middleware');
const bodyValidation = require('../middlewares/body-validation.middleware');
const { friendMailValidator, friendAnswerValidator } = require('../validators/user.validator');

const friendRouter = require('express').Router();

// Récupération de tous les utilisateurs de la DB via le controller (recherche et ajout d'un ami)
friendRouter.get('/', authentificate(), friendController.getAll);

// Ajout d'un ami
friendRouter.post('/', authentificate(), bodyValidation(friendMailValidator), friendController.addFriendRequest);

// Répondre à une demande d'amis !
friendRouter.put('/', authentificate(), bodyValidation(friendAnswerValidator), friendController.updateFriendStatus);

//TODO à décommenter quand ça sera implémenter
// Supprimer un ami de sa liste d'ami
// friendRouter.delete('/friend/:id', authentificate(), friendController.deleteFriend);

// Route ADMIN : suppression d'un compte utilisateur de l'application globable
// friendRouter.delete(':id', authentificateHasAdmin(), friendController.delete); //TODO vérifier la logique d'accès. Renvoie actuellement une 404 native lors d'un test

module.exports = friendRouter;