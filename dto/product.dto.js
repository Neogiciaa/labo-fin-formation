class ProductDTO {

    constructor(data) {
        this.id = data.id;
        this.libelle = data.libelle;
        this.description = data.description;
        this.stockagePlace = data.stockagePlace;
        this.quantity = data.quantity;
        this.minQuantity = data.minQuantity;
        this.maxQuantity = data.maxQuantity;
        this.peremptionDate = data.peremptionDate;
        this.perissable = data.perissable;
        this.commentary = data.commentary;
    }
};

module.exports = {
    ProductDTO
};