/**
 * Modele de réponse de l'api lors d'une erreur
 */
class ErrorResponse {
    constructor(message, status = 400) {
        this.message = message;
        this.status = status;
    }
}

/**
 * Modele de réponse de l'api lors d'une erreur de validation du body
 */
class InvalidBodyErrorResponse extends ErrorResponse {
    constructor(message, fieldErrors, status = 422) {
        super(message, status);
        this.fieldErrors = fieldErrors;
    }
}


module.exports = {
    ErrorResponse,
    InvalidBodyErrorResponse
};