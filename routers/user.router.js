const userController = require('../controllers/user.controller');
const bodyValidation = require('../middlewares/body-validation.middleware');
const { profilOptionsValidator } = require('../validators/user.validator');
const authentificate = require('../middlewares/authentificate.middleware');
const authentificateHasAdmin = require('../middlewares/authentificateHasAdmin.middleware');

const userRouter = require('express').Router();

// Récupération de tous les utilisateurs de la DB via le controller (recherche et ajout d'un ami)
userRouter.get('/', authentificate(), userController.getAll)

// Récupération d'un utilisateur via son id pour afficher chaque utilisateur présent dans la liste d'ami
userRouter.get('/:id', authentificate(), userController.getById)

// Ajout d'un ami
userRouter.post('/', authentificate(), userController.addFriend)

// Mise à jour des données personnelles du profil utilisateur
userRouter.put('/:id', authentificate(), bodyValidation(profilOptionsValidator), userController.update)

// Accepter les demandes d'amis !
userRouter.put('/friend/:id', authentificate(), userController.acceptFriendRequest)

// Refuser la demande d'amis !
userRouter.put('/friend/:id', authentificate(), userController.declineFriendRequest)


// Supprimer un ami de sa liste d'ami
userRouter.delete('/friend/:id', authentificate(), userController.deleteFriend);

// Route ADMIN : suppression d'un compte utilisateur de l'application globable
userRouter.delete('/:id', authentificate(), userController.delete); //TODO vérifier la logique d'accès. Renvoie actuellement une 404 native lors d'un test


module.exports = userRouter;