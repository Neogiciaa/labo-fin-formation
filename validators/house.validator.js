const yup = require('yup');

const houseValidator = yup.object().shape({
    name: yup.string().required().min(1).max(100),
    street: yup.string().min(1).max(50).nullable(true),
    number: yup.string().min(1).max(10).nullable(true),
    postalCode: yup.string().min(1).max(10).nullable(true),
    city: yup.string().trim().min(1).max(100).nullable(true),
    country: yup.string().min(1).max(50).nullable(true),
    mainHouse: yup.boolean().nullable(true)

});

module.exports = {
    houseValidator
};