class ExpressError extends Error {
    constructor( StatusCode, message) {
        super();
        this.StatusCode = StatusCode;
        this.Message = Message;
    } 
}

module.exports = ExpressError;