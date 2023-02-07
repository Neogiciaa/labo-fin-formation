const { HouseDTO } = require('../dto/house.dto');
const db = require('../models')

const houseService = {

    getAll: async () => {
        // Récupération des maisons
        const houseDTO = await db.House.findAll();
        return houseDTO;
    },

    getById: async (id) => {
        // Récupération d'une maison via son id
        const house = await db.House.findByPk(id);

        if (!house) {
            return null;
        }

        return new HouseDTO(house);
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        // Ajouter un user dans la DB via la méthode "create"
        const newHouse = await db.House.create(data);

        return new HouseDTO(newHouse);
    },

    update: async (id, data) => {
        if (!data) {
            throw new Error('Data is required !');
        };

        const dataUpdated = await db.House.update(data, {
            where: { id },
            validate: true,
            returning: true
        });

        if (dataUpdated[0] !== 1) {
            return null;
        }

        // Envoi des données dans un objet DTO
        const house = dataUpdated.flat()[1].dataValues
        return new HouseDTO(house);
    },

    delete: async (id) => {
        // Récupération de l'id de la DB
        const houseToDelete = await db.House.destroy({
            where: { id }
        })

            .catch((error) => {
                console.log(error);
            });

        // Si le user n'existe pas, stopper la fonction
        if (houseToDelete == 0) {
            return null;
        }

        return houseToDelete === 1;
    },
};

module.exports = houseService;