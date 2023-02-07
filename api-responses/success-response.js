/**
 * Modele de réponse de l'api pour renvoyer un objet
 */
class SuccessResponse {
    constructor(result, status = 200) {
        this.result = result;
        this.status = status;
    }
}

module.exports = {
    SuccessResponse
};