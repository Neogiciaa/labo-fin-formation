const yup = require('yup');

const regexPwd = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+)/;
const regexPwdError = 'Mot de passe trop faible';

const userRegisterValidator = yup.object().shape({
    pseudo: yup.string().trim().required().max(20),
    lastName: yup.string().trim().required().min(2).max(20),
    firstName: yup.string().trim().required().min(2).max(20),
    mail: yup.string().trim().required().email().min(1).max(50),
    password: yup.string().min(8).matches(regexPwd, regexPwdError).required(),
    isAdmin: yup.boolean()
});

const userLoginValidator = yup.object().shape({
    mail: yup.string().trim().required(),
    password: yup.string().required(),
    isAdmin: yup.boolean()
});

const profilOptionsValidator = yup.object().shape({
    pseudo: yup.string().trim().max(20).nullable(true),
    password: yup.string().min(8).matches(regexPwd, regexPwdError),
    mail: yup.string().trim().max(50).nullable(true),
    lastName: yup.string().min(1).max(20).nullable(true),
    firstName: yup.string().min(2).max(20).nullable(true),
    street: yup.string().min(1).max(50).nullable(true),
    number: yup.string().min(1).max(10).nullable(true),
    postalCode: yup.string().min(1).max(10).nullable(true),
    city: yup.string().trim().min(1).max(100).nullable(true),
    country: yup.string().min(1).max(50).nullable(true)
});


const friendMailValidator = yup.object().shape({
    mail: yup.string().trim().required().email().min(1).max(50)
});

const friendAnswerValidator = yup.object().shape({
    isAccepted: yup.boolean()
})

// Feature qui viendra avec l'ajout des commandes/livraisons sur base du panier dans la phase 3 du projet

// const basketValidator = yup.object().shape({
//     lastname: yup.string().min(1).max(20).required(),
//     firstname: yup.string().min(2).max(20).required(),
//     street: yup.string().min(1).max(50).required(),
//     number: yup.string().min(1).max(10).required(),
//     postalCode: yup.string().min(1).max(10).required(),
//     city: yup.string().trim().min(1).max(100).required(),
//     country: yup.string().min(1).max(50).required()
// });

module.exports = {
    userRegisterValidator,
    userLoginValidator,
    profilOptionsValidator,
    friendMailValidator,
    friendAnswerValidator
};