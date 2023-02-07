
class UserDTO {

    constructor(data) {
        this.id = data.id;
        this.pseudo = data.pseudo;
        this.lastName = data.lastName;
        this.firstName = data.firstName;
        this.mail = data.mail;
        this.hashpassword = data.hashpassword;
        this.street = data.street;
        this.number = data.number;
        this.postalCode = data.postalCode;
        this.city = data.city;
        this.country = data.country;
    }
};

module.exports = {
    UserDTO
};