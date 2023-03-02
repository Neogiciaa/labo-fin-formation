const jwt = require('jsonwebtoken');

const generateJWT = ({ id, mail }) => {
    return new Promise((resolve, reject) => {

        const data = { id, mail };
        const secret = process.env.JWT_SECRET;
        const options = {
            algorithm: 'HS512',
            audience: process.env.JWT_AUDIENCE,
            issuer: process.env.JWT_ISSUER,
            expiresIn: '5h'
        };

        jwt.sign(data, secret, options, (error, token) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(token);
        });
    });
};

const decodeJWT = (token) => {


    if (!token) {
        return Promise.reject(new Error('Invalid JWT'));
    }

    return new Promise((resolve, reject) => {

        const secret = process.env.JWT_SECRET;
        const options = {
            audience: process.env.AUDIENCE,
            issuer: process.env.ISSUER
        }

        jwt.verify(token, secret, options, (error, data) => {
            if (error) {
                reject(error);
                return;
            }

            resolve({
                id: data.id,
                mail: data.mail
            });
        });
    });
}

module.exports = {
    generateJWT,
    decodeJWT
};