const yup = require('yup');

const houseValidator = yup.object().shape({
    name: yup.string().required().min(1).max(100),
    hasAdmin: yup.number().required(),
    street: yup.string().min(1).max(50).nullable(true),
    number: yup.string().min(1).max(10).nullable(true),
    postalCode: yup.string().min(1).max(10).nullable(true),
    city: yup.string().trim().min(1).max(100).nullable(true),
    country: yup.string().min(1).max(50).nullable(true)

});


module.exports = {
    houseValidator
};