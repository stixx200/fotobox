export class FotoboxError extends Error {
  public code: string;

  constructor(message: string | Error | FotoboxError, code?: string) {
    if (typeof message === 'string') {
      super(message);
      this.code = code;
    } else if (message instanceof FotoboxError) {
      super(message.message);
      this.code = message.code;
    } else {
      super(message.message);
      this.code = code;
    }
  }

  toJSON() {
    return {
      stack: this.stack,
      message: this.message,
      code: this.code,
    };
  }
}
