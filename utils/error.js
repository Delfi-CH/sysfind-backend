class GeneralError {
    constructor(message, httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }
    getCode() {
        return this.httpStatus;
    }
    getMessage() {
        return this.message;
    }
}

class NotFoundError extends GeneralError {
    constructor(message) {
        super(message, 404);
    }
}

class BadRequestError extends GeneralError {
    constructor(message) {
        super(message, 400);
    }
}

class UnauthorisedError extends GeneralError {
    constructor(message) {
        super(message, 401);
    }
}

class DatabaseError extends GeneralError {
    constructor(message) {
        super(message, 500);
    }
}

module.exports = {GeneralError, NotFoundError, BadRequestError, UnauthorisedError, DatabaseError};