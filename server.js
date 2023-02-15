'use strict';

// Chargement du fichier d'environnement
require('dotenv').config({
    override: false
});

// Import d'express
const express = require('express');
require('express-async-errors');

// Import
const cors = require('cors');
const morgan = require('morgan');
const chalk = require('chalk');
const router = require('./routers/router');


// Initialisation de la base de donnée (via sequelize)
const db = require('./models');

// - Connection
db.sequelize.authenticate()
    .then(() => console.log(chalk.blue('Connection DB successfull')))
    .catch((error) => console.log(chalk.red('Connection DB fail'), error));

// - Sync avec la base de donnée (necessaire les droits DDL)
if (process.env.NODE_ENV === 'development') {
    //  db.sequelize.sync({ alter: { drop: false } });  // A dé-commenter pour créer les tables direct au lancement du serv !
}

// Création de la Web API
const app = express();

// Add middleware
// - Permet de gérer les erreurs "cross-origin resource sharing" (CORS) 
app.use(cors());
// - Ajout d'un logger
app.use(morgan('tiny'));
// - Gestion des données du "body" de type "application/json"
app.use(express.json());

// Ajout du routing
app.use('/api', router);

// Gestion des erreurs
app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(error);
        res.status(500).json(error);
        return;
    }

    res.sendStatus(500);
});

// Demarrage du serveur
app.listen(process.env.PORT, () => {
    console.log(chalk.magenta(`Web API up on port ${process.env.PORT}`));
});