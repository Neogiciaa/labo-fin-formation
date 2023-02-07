
class HouseDTO {

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.street = data.street;
        this.number = data.number;
        this.postalCode = data.postalCode;
        this.city = data.city;
        this.country = data.country;
    }
};

module.exports = {
    HouseDTO
};