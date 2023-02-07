const bodyValidation = require('../middlewares/body-validation.middleware');
const productController = require('../controllers/product.controller');
const { productValidator } = require('../validators/product.validator');
const authentificate = require('../middlewares/authentificate.middleware');

const productRouter = require('express').Router();

productRouter.get('/', authentificate(), productController.getAll);   // TODO A voir si on rajoute un système de recherche par Libelle/Marque etcc...

productRouter.post('/', authentificate(), bodyValidation(productValidator), productController.add);

productRouter.get('/:id', authentificate(), productController.getById);

productRouter.put('/:id', authentificate(), bodyValidation(productValidator), productController.update);

productRouter.delete('/:id', authentificate(), productController.delete);

module.exports = productRouter;