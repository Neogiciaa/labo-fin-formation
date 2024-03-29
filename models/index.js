const { Sequelize } = require('sequelize');

// Récupération des variables d'environnement 
const { DB_SERVER, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;

// Initialisation de Sequelize 
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_SERVER,
    port: DB_PORT,
    dialect: 'mssql'
});

// Création d'un objet db 
const db = {};

// Ajout de l'instance de sequelize
db.sequelize = sequelize;

// Ajouter des models
db.User = require('./user.model')(sequelize);
db.House = require('./house.model')(sequelize);
db.Product = require('./product.model')(sequelize);
db.HouseToUser = require('./house_user.model')(sequelize);
db.MTM_friendlist = require('./MTM_friendlist.model')(sequelize);

// Ajout des relations

// Définir les relations ! (Many to Many)
db.User.belongsToMany(db.User, { as: "user", through: 'MTM_friendlist', foreignKey: "user" });
db.User.belongsToMany(db.User, { as: "friend", through: 'MTM_friendlist', foreignKey: "friend" });

// - Many to Many (House <-> User)
// db.House.belongsToMany(db.User, { through: 'house_user' });
// db.User.belongsToMany(db.House, { through: 'house_user' });


// Export de l'objet "db"
module.exports = db;