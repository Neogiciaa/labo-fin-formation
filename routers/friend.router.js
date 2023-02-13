const friendController = require('../controllers/friend.controller');
const authentificate = require('../middlewares/authentificate.middleware');
const bodyValidation = require('../middlewares/body-validation.middleware');
const { friendMailValidator, friendAnswerValidator } = require('../validators/user.validator');

const friendRouter = require('express').Router();

// Récupération de tous les utilisateurs de la DB via le controller (recherche et ajout d'un ami)
friendRouter.get('/', authentificate(), friendController.getAll);

// Récupération d'un utilisateur via son id pour afficher chaque utilisateur présent dans la liste d'ami
// friendRouter.get('/:id', authentificate(), friendController.getById)

// // Ajout d'un ami
friendRouter.post('/', authentificate(), bodyValidation(friendMailValidator), friendController.addFriendRequest);

// // // Mise à jour des données personnelles du profil utilisateur
// // friendRouter.put('/:id', authentificate(), bodyValidation(profilOptionsValidator), friendController.update)

// // Répondre à une demande d'amis !
friendRouter.put('/:id', authentificate(), bodyValidation(friendAnswerValidator), friendController.updateAnswerFromFuturFriend);


// // Supprimer un ami de sa liste d'ami
// friendRouter.delete('/friend/:id', authentificate(), friendController.deleteFriend);

// // Route ADMIN : suppression d'un compte utilisateur de l'application globable
// friendRouter.delete(':id', authentificateHasAdmin(), friendController.delete); //TODO vérifier la logique d'accès. Renvoie actuellement une 404 native lors d'un test


module.exports = friendRouter;