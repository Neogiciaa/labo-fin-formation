const { HouseDTO } = require('../dto/house.dto');
const db = require('../models')

const houseService = {

    getAll: async () => {
        // Récupération des maisons
        const house = await db.House.findAll();

        if (!house) {

            return null;
        }

        // Envoi des données dans un objet DTO
        return {
            houses: house.map(house => new HouseDTO(house))
        }
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

    updateMainHouseStatus: async (houseId) => {
    
        db.House.findByPk(houseId).then(async(house) => {
            if (house) {
                await house.update({mainHouse : true})
            }
        })
    },
    //TODO Si la maison a bien été supprimé et qu'elle était considérée comme la Résidence Principale, il faut transférer ce status à la prochaine maison sur la liste
    delete: async (id) => {
        // Récupération de l'id de la DB
        const houseToDelete = await db.House.destroy({
            where: { id }
        })

            .catch((error) => {
                console.log(error);
            });

        console.log("houseToDelete === ", houseToDelete);

        // Si la maison n'existe pas, stopper la fonction
        if (houseToDelete == 0) {
            return null;
        }

        return houseToDelete === 1;
    },
};

module.exports = houseService;