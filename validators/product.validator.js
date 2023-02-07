const yup = require('yup');

const productValidator = yup.object().shape({
    libelle: yup.string().trim().required().min(2).max(20),
    description: yup.string().min(2).max(1000), // Required ??
    stockagePlace: yup.string().required().min(2).max(20),
    quantity: yup.number().nullable(true),
    minQuantity: yup.number().nullable(true),
    maxQuantity: yup.number().nullable(true),
    peremptionDate: yup.date().required(),
    perissable: yup.boolean().required(),
    commentary: yup.string().nullable(true)
});

module.exports = {
    productValidator
};