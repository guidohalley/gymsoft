class ValidationError extends Error {
    constructor(message,code = 400) {
      super(message);
      this.name = "ValidationError";
      this.code = code;
    }
  }

export default  ValidationError;