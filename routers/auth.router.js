const bodyValidation = require('../middlewares/body-validation.middleware');
const authController = require('../controllers/auth.controller');
const { userLoginValidator, userRegisterValidator } = require('../validators/user.validator');


const authRouter = require('express').Router();

authRouter.post('/login', bodyValidation(userLoginValidator), authController.login);

authRouter.post('/register', bodyValidation(userRegisterValidator), authController.register);

module.exports = authRouter;