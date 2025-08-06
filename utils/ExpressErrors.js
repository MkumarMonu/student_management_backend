class ExpressError extends Error {
  constructor(statusCode, message, error = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.data = null;
    this.error = error;

    if(stack){
      this.stack = stack;
    }
  }
}

module.exports = ExpressError;
