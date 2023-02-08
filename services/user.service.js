const { UserDTO } = require('../dto/user.dto');
const db = require('../models');
const argon2 = require('argon2');


const userService = {

    getAll: async () => {
        // Récupération des users via sequelize
        const user = await db.User.findAll();

        // Envoi des données dans un objet DTO
        return {
            users: user.map(user => new UserDTO(user))
        }
    },

    getById: async (id) => {

        const user = await db.User.findByPk(id);

        if (!user) {
            return null;
        }

        // Envoi des données dans un objet DTO
        return new UserDTO(user);
    },

    add: async (data) => {

        if (!data) {
            throw new Error('Data is required !');
        }

        console.log('DATAS !!', data);


        // Ajouter un user dans la DB via la méthode "create"
        const newUser = await db.User.create(data);

        return new UserDTO(newUser);
    },

    update: async (id, data) => {

        if (!data) {
            console.log("DATAS dans le UserService -> ", data);
            throw new Error('Data is required !');
        };

        if (data.password !== undefined) {
            data.hashPassword = await argon2.hash(data.password)
        };

        const dataUpdated = await db.User.update(data, {
            where: { id },
            validate: true,
            returning: true
        });

        if (dataUpdated[0] !== 1) {
            return null;
        }

        // Envoi des données dans un objet DTO
        const user = dataUpdated.flat()[1].dataValues
        return new UserDTO(user);

    },

    delete: async (id) => {
        // Récupération de l'id de la DB
        const userToDeleted = await db.User.destroy({
            where: { id }
        })

            .catch((error) => {
                console.log(error);
            });

        // Si le user n'existe pas, stopper la fonction
        if (userToDeleted == undefined) {
            return null;
        }

        console.log("Compte a delete via son id -> ", id);

        return userToDeleted === 1;
    },

    getHashPassword: async (mail) => {

        const user = await db.User.findOne({
            where: { mail },
            attributes: ['hashPassword']
        });

        return user?.hashPassword;
    },

    getByMail: async (mail) => {
        const user = await db.User.findOne({
            where: { mail }
        });

        return new UserDTO(user);
    },

    checkIfMailExists: async (mail) => {

        const user = await db.User.findOne({
            where: { mail }
        });

        console.log("Log de Mail dans la fonction Checkifmailexists ->", mail);
        console.log("Je suis user après checkMail", user);

        if (user == null) {
            return;

        } else {
            return user.dataValues.id;
        }

    },

    addFriend: async (userId, friendId) => {

        await db.MTM_friendlist.create({
            userId,
            friendId,

        });
    },

    deleteFriend: async (userId, friendId) => {
        // TODO Supprimer le lien entre deux amis :(
    },

    acceptFriendRequest: async (userId, friendId, isAccepted) => {

        let user = await db.MTM_friendlist.findOne({
            where: { friendId, userId }
        })

        console.log(" !", user);
        user.dataValues.isAccepted = true

        user.update(isAccepted)
            .then((res) => {
                isAccepted = true;
                console.log("IS ACCEPTED OR NOT ?", isAccepted);
            })
            .catch((error) => {
                console.log(error);
            });
    },

    declineFriendRequest: async (userId, friendId) => {

    }

    // TODO check l'implémentation d'un GetHouse par l'id du user
    // getHouses: async (id) => {
    //     const user = await User.findById(id)  -- Probablement a mettre dans le House Service ??
    // } 
};

module.exports = userService