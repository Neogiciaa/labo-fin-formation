const { ProductDTO } = require('../dto/product.dto');
const db = require('../models');

const productService = {

    getAll: async () => {
        // Récupération des users via sequelize
        const products = await db.Product.findAll();

        // Envoi des données dans un objet DTO
        return products;
    },

    getById: async (id) => {
        const product = await db.Product.findByPk(id);

        if (!product) {
            return null;
        }

        // Envoi des données dans un objet DTO
        return new ProductDTO(product);
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        // Ajouter un produit dans la DB via la méthode "create"
        const newProduct = await db.Product.create(data);

        return new ProductDTO(newProduct);
    },

    update: async (id, data) => {

        if (!data) {
            throw new Error('Data is required !');
        };

        const dataUpdated = await db.Product.update(data, {
            where: { id },
            validate: true,
            returning: true
        });

        if (dataUpdated[0] !== 1) {
            return null;
        }

        // Envoi des données dans un objet DTO
        const product = dataUpdated.flat()[1].dataValues
        return new ProductDTO(product);
    },

    delete: async (id) => {

        const productToDelete = await db.Product.destroy({

            where: { id }})
            
            .catch((error) => {
                console.log(error);
        });
            
        // Si le produit n'existe pas en DB, stopper la fonction
        if (productToDelete == 0) {
            return null;
        };
            
        return productToDelete === 1;
    },
};


module.exports = productService;