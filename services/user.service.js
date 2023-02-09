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
        let userExist = await db.User.findByPk(id);

        // Si l'id récupéré n'existe pas = undefined ---> alors stopper la fonction
        if (userExist == undefined) {
            return;
        }

        // Si l'id de la DB existe, le supprimer de la DB
        userExist = await db.User.destroy({
            where: { id }
        })

            .catch((error) => {
                console.log(error);
            });

        return userExist === 1;
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
            console.log("L'utilisateur recherché n'existe pas !");
            return;

        } else {
            return user.dataValues.id;
        }

    },

    // TODO check l'implémentation d'un GetHouse par l'id du user
    // getHouses: async (id) => {
    //     const user = await User.findById(id)  -- Probablement a mettre dans le House Service ??
    // } 
};

module.exports = userService