const argon2 = require('argon2');
const userService = require('./user.service');

const authService = {

    register: async (pseudo, lastName, firstName, mail, password) => {

        // Hashage du mot de passe
        const hashPassword = await argon2.hash(password);

        // Création du user dans la DB via le userService
        const user = await userService.add({ pseudo, lastName, firstName, mail, hashPassword });

        console.log('user', user);

        // FIXME ADD JWT ??

        return user;
    },

    login: async (mail, password) => {

        // Récupérer le hashPassword lié à l'email
        const hashPassword = await userService.getHashPassword(mail);

        // Si l'email est invalide -> Erreur
        if (!hashPassword) {
            return null;
        }

        // Tester le mot de passe avec le hash
        const isValid = await argon2.verify(hashPassword, password);

        // Si le mot de passe est invalide -> Erreur
        if (!isValid) {
            return null;
        }

        // Envoi des infos du user
        return await userService.getByMail(mail);
    }

};

module.exports = authService;