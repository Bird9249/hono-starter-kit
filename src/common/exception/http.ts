import { SafeParseError, typeToFlattenedError } from "zod";

export class HTTPException extends Error {
  status!: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "http";
    this.status = status;
  }
}

export class BadRequestException extends HTTPException {
  constructor(message: string = "Bad Request!") {
    super(message, 400);
  }
}

export class UnauthorizedException extends HTTPException {
  constructor(message: string = "Unauthorized!") {
    super(message, 401);
  }
}

export class NotFoundException extends HTTPException {
  constructor(message: string = "Not Found!") {
    super(message, 404);
  }
}

export class UnprocessableContentException extends HTTPException {
  constructor(message: string = "Unprocessable Content!") {
    super(message, 422);
  }
}

export class ValidationFailed extends BadRequestException {
  error?: typeToFlattenedError<any, string>;

  constructor(
    err: SafeParseError<any>,
    message: string = "Validation Failed!"
  ) {
    super(message);

    this.error = err.error.formErrors;
  }
}
