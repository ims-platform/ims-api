export class HttpException extends Error {
  public readonly errors?: unknown;

  private constructor(
    public readonly status: number,
    message: string,
    errors?: unknown,
  ) {
    super(message);
    this.errors = errors;
    Object.setPrototypeOf(this, HttpException.prototype);
  }

  static badRequest(message: string, errors?: unknown) {
    return new HttpException(400, message, errors);
  }
  static unauthorized(message: string) {
    return new HttpException(401, message);
  }
  static forbidden(message: string) {
    return new HttpException(403, message);
  }
  static notFound(message: string) {
    return new HttpException(404, message);
  }
  static conflict(message: string) {
    return new HttpException(409, message);
  }
  static internalServer(message: string) {
    return new HttpException(500, message);
  }
}
